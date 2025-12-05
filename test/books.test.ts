
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { BooksService } from '../src/books/books.service';
import { CreateBookDto } from '../src/books/dtos/books.create.dto';

describe('Books Microservice TCP Tests', () => {
  let client: ClientProxy;
  let createdBookId: number;

  beforeAll(async () => {
    // Crear cliente TCP para conectarse al microservicio
    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3002,
      },
    });

    await client.connect();
    console.log('Cliente TCP conectado al microservicio Books');
  });

  afterAll(async () => {
    await client.close();
    console.log('Cliente TCP desconectado');
  });

  describe('CRUD Operations', () => {
    // Test 1: Crear un libro
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'El Señor de los Anillos',
        author: 'J.R.R. Tolkien',
        year: 1954,
        isbn: '9780618640157',
        stock: 10,
        isActive: true,
      };

      const response = await client.send({ cmd: 'createBook' }, createBookDto).toPromise();
      
      expect(response).toBeDefined();
      expect(response.title).toBe(createBookDto.title);
      expect(response.author).toBe(createBookDto.author);
      expect(response.isbn).toBe(createBookDto.isbn);
      expect(response.stock).toBe(createBookDto.stock);
      expect(response.isActive).toBe(true);
      
      createdBookId = response.id;
      console.log(`Libro creado con ID: ${createdBookId}`);
    }, 10000);

    // Test 2: No debe crear libro con ISBN duplicado
    it('should not create a book with duplicate ISBN', async () => {
      const createBookDto: CreateBookDto = {
        title: 'El Hobbit',
        author: 'J.R.R. Tolkien',
        year: 1937,
        isbn: '9780618640157', // Mismo ISBN que el anterior
        stock: 5,
        isActive: true,
      };

      try {
        await client.send({ cmd: 'createBook' }, createBookDto).toPromise();
        fail('Debería haber lanzado un error por ISBN duplicado');
      } catch (error) {
        expect(error.message).toContain('Libro con ISBN');
        expect(error.message).toContain('ya existe');
      }
    }, 10000);

    // Test 3: Validación de stock mínimo
    it('should not create a book with stock <= 0', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Libro con Stock Inválido',
        author: 'Autor Test',
        year: 2023,
        isbn: '9781234567890',
        stock: 0, // Stock inválido
        isActive: true,
      };

      try {
        await client.send({ cmd: 'createBook' }, createBookDto).toPromise();
        fail('Debería haber lanzado un error por stock inválido');
      } catch (error) {
        expect(error.message).toContain('stock');
        expect(error.message).toContain('mayor');
      }
    }, 10000);

    // Test 4: Obtener todos los libros
    it('should find all books', async () => {
      const response = await client.send({ cmd: 'findAllBooks' }, {}).toPromise();
      
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(0);
      
      const book = response.find(b => b.id === createdBookId);
      expect(book).toBeDefined();
      expect(book.title).toBe('El Señor de los Anillos');
      
      console.log(`Total de libros activos: ${response.length}`);
    }, 10000);

    // Test 5: Buscar libro por ID
    it('should find one book by ID', async () => {
      const response = await client.send({ cmd: 'findOneBook' }, createdBookId).toPromise();
      
      expect(response).toBeDefined();
      expect(response.id).toBe(createdBookId);
      expect(response.title).toBe('El Señor de los Anillos');
      expect(response.isbn).toBe('9780618640157');
    }, 10000);

    // Test 6: Buscar libro por ISBN
    it('should find book by ISBN', async () => {
      const isbn = '9780618640157';
      const response = await client.send({ cmd: 'findBookByISBN' }, isbn).toPromise();
      
      expect(response).toBeDefined();
      expect(response.isbn).toBe(isbn);
      expect(response.id).toBe(createdBookId);
    }, 10000);

    // Test 7: Actualizar un libro
    it('should update a book', async () => {
      const updateData = {
        id: createdBookId,
        updateBookDto: {
          title: 'El Señor de los Anillos - Edición Especial',
          stock: 15,
        }
      };

      const response = await client.send({ cmd: 'updateBook' }, updateData).toPromise();
      
      expect(response).toBeDefined();
      expect(response.title).toBe('El Señor de los Anillos - Edición Especial');
      expect(response.stock).toBe(15);
      expect(response.author).toBe('J.R.R. Tolkien'); // Debe mantener otros campos
      
      console.log(`Libro actualizado: ${response.title}, Stock: ${response.stock}`);
    }, 10000);

    // Test 8: Actualizar stock (incrementar)
    it('should increment book stock', async () => {
      const updateData = { id: createdBookId, quantity: 5 };
      const response = await client.send({ cmd: 'incrementBookStock' }, updateData).toPromise();
      
      expect(response).toBeDefined();
      expect(response.stock).toBe(20); // 15 + 5 = 20
    }, 10000);

    // Test 9: Actualizar stock (decrementar)
    it('should decrement book stock', async () => {
      const updateData = { id: createdBookId, quantity: 3 };
      const response = await client.send({ cmd: 'decrementBookStock' }, updateData).toPromise();
      
      expect(response).toBeDefined();
      expect(response.stock).toBe(17); // 20 - 3 = 17
    }, 10000);

    // Test 10: No permitir stock negativo
    it('should not allow negative stock', async () => {
      const updateData = { id: createdBookId, quantity: 20 }; // Intentar decrementar más del disponible
      
      try {
        await client.send({ cmd: 'decrementBookStock' }, updateData).toPromise();
        fail('Debería haber lanzado un error por stock insuficiente');
      } catch (error) {
        expect(error.message).toContain('Stock insuficiente');
      }
    }, 10000);

    // Test 11: Búsqueda por título
    it('should search books by title', async () => {
      const response = await client.send({ cmd: 'searchBooksByTitle' }, 'Señor').toPromise();
      
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(0);
      expect(response[0].title).toContain('Señor');
    }, 10000);

    // Test 12: Búsqueda por autor
    it('should search books by author', async () => {
      const response = await client.send({ cmd: 'searchBooksByAuthor' }, 'Tolkien').toPromise();
      
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(0);
      expect(response[0].author).toContain('Tolkien');
    }, 10000);

    // Test 13: Eliminación lógica (soft delete)
    it('should remove a book (soft delete)', async () => {
      const response = await client.send({ cmd: 'removeBook' }, createdBookId).toPromise();
      
      expect(response).toBeDefined();
      expect(response.isActive).toBe(false);
      expect(response.id).toBe(createdBookId);
      
      console.log(`Libro marcado como inactivo (soft delete): ID ${createdBookId}`);
    }, 10000);

    // Test 14: Verificar que libro eliminado no aparece en búsquedas
    it('should not find removed book in active list', async () => {
      const response = await client.send({ cmd: 'findAllBooks' }, {}).toPromise();
      
      const removedBook = response.find(book => book.id === createdBookId);
      expect(removedBook).toBeUndefined();
      
      // Pero debe aparecer en la lista que incluye inactivos
      const allBooks = await client.send({ cmd: 'findAllBooksIncludingInactive' }, {}).toPromise();
      const foundBook = allBooks.find(book => book.id === createdBookId);
      expect(foundBook).toBeDefined();
      expect(foundBook.isActive).toBe(false);
    }, 10000);
  });

  describe('Validación de ISBN', () => {
    it('should validate ISBN format', async () => {
      const invalidBook: CreateBookDto = {
        title: 'Libro con ISBN inválido',
        author: 'Autor Test',
        year: 2023,
        isbn: 'ISBN-INVALIDO', // ISBN inválido
        stock: 5,
        isActive: true,
      };

      try {
        await client.send({ cmd: 'createBook' }, invalidBook).toPromise();
        fail('Debería haber lanzado un error por ISBN inválido');
      } catch (error) {
        expect(error.message).toContain('ISBN');
        expect(error.message).toContain('válido');
      }
    }, 10000);
  });

  describe('Libros con bajo stock', () => {
    it('should get books with low stock', async () => {
      // Primero creamos un libro con bajo stock
      const lowStockBook: CreateBookDto = {
        title: 'Libro con Bajo Stock',
        author: 'Autor de Prueba',
        year: 2023,
        isbn: '9781111111111',
        stock: 2, // Bajo stock
        isActive: true,
      };

      const newBook = await client.send({ cmd: 'createBook' }, lowStockBook).toPromise();
      
      // Buscar libros con stock bajo (menor a 5 por defecto)
      const lowStockBooks = await client.send({ cmd: 'getLowStockBooks' }, 5).toPromise();
      
      expect(Array.isArray(lowStockBooks)).toBe(true);
      
      const found = lowStockBooks.find(book => book.id === newBook.id);
      expect(found).toBeDefined();
      expect(found.stock).toBeLessThan(5);
      
      console.log(`Libros con bajo stock: ${lowStockBooks.length}`);
    }, 15000);
  });
});