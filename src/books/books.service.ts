
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateBookDto } from './dtos/books.create.dto';
import { UpdateBookDto } from './dtos/books.update.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBookDto: CreateBookDto) {
        // Verificar si el ISBN ya existe
        const existingBook = await this.prisma.book.findUnique({
            where: { isbn: createBookDto.isbn }
        });

        if (existingBook) {
            throw new ConflictException(`Libro con ISBN ${createBookDto.isbn} ya existe`);
        }

        // Validar que el stock sea mayor a 0
        if (createBookDto.stock <= 0) {
            throw new BadRequestException('El stock debe ser mayor a 0');
        }

        return this.prisma.book.create({
            data: {
                ...createBookDto,
                isActive: createBookDto.isActive ?? true
            }
        });
    }

    findAll() {
        return this.prisma.book.findMany({
            where: { isActive: true },
            orderBy: { title: 'asc' }
        });
    }

    findAllIncludingInactive() {
        return this.prisma.book.findMany({
            orderBy: { title: 'asc' }
        });
    }

    async findOne(id: number) {
        const book = await this.prisma.book.findUnique({ 
            where: { id } 
        });

        if (!book) {
            throw new NotFoundException(`Libro con ID ${id} no encontrado`);
        }

        return book;
    }

    async findByISBN(isbn: string) {
        const book = await this.prisma.book.findUnique({ 
            where: { isbn } 
        });

        if (!book) {
            throw new NotFoundException(`Libro con ISBN ${isbn} no encontrado`);
        }

        return book;
    }

    async update(id: number, updateBookDto: UpdateBookDto) {
        // Primero verificamos que el libro exista
        await this.findOne(id);

        // Si se está actualizando el ISBN, verificar que no exista otro con el mismo
        if (updateBookDto.isbn) {
            const existingWithISBN = await this.prisma.book.findUnique({
                where: { isbn: updateBookDto.isbn }
            });

            if (existingWithISBN && existingWithISBN.id !== id) {
                throw new ConflictException(`Otro libro con ISBN ${updateBookDto.isbn} ya existe`);
            }
        }

        // Validar stock si se está actualizando
        if (updateBookDto.stock !== undefined && updateBookDto.stock <= 0) {
            throw new BadRequestException('El stock debe ser mayor a 0');
        }

        return this.prisma.book.update({
            where: { id },
            data: updateBookDto
        });
    }

    async remove(id: number) {
        // Verificar que el libro existe
        await this.findOne(id);

        // Soft delete: actualizar isActive a false
        return this.prisma.book.update({
            where: { id },
            data: { isActive: false }
        });
    }

    async hardDelete(id: number) {
        // Verificar que el libro existe
        await this.findOne(id);

        // Eliminación física (solo para admin o casos especiales)
        return this.prisma.book.delete({
            where: { id }
        });
    }

    async updateStock(id: number, quantity: number) {
        const book = await this.findOne(id);

        const newStock = book.stock + quantity;
        
        if (newStock < 0) {
            throw new BadRequestException('Stock insuficiente');
        }

        return this.prisma.book.update({
            where: { id },
            data: { stock: newStock }
        });
    }

    async incrementStock(id: number, quantity: number) {
        if (quantity <= 0) {
            throw new BadRequestException('La cantidad a incrementar debe ser mayor a 0');
        }

        return this.updateStock(id, quantity);
    }

    async decrementStock(id: number, quantity: number) {
        if (quantity <= 0) {
            throw new BadRequestException('La cantidad a decrementar debe ser mayor a 0');
        }

        return this.updateStock(id, -quantity);
    }

    async searchByTitle(title: string) {
        return this.prisma.book.findMany({
            where: {
                title: {
                    contains: title,
                    
                },
                isActive: true
            },
            orderBy: { title: 'asc' }
        });
    }

    async searchByAuthor(author: string) {
        return this.prisma.book.findMany({
            where: {
                author: {
                    contains: author,
                   
                },
                isActive: true
            },
            orderBy: { author: 'asc' }
        });
    }

    async getBooksByYear(year: number) {
        return this.prisma.book.findMany({
            where: {
                year: year,
                isActive: true
            },
            orderBy: { title: 'asc' }
        });
    }

    async getLowStockBooks(threshold: number = 5) {
        return this.prisma.book.findMany({
            where: {
                stock: {
                    lt: threshold
                },
                isActive: true
            },
            orderBy: { stock: 'asc' }
        });
    }
}