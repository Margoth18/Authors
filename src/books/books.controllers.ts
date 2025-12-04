
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/books.create.dto';
import { UpdateBookDto } from './dtos/books.update.dto';

@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @MessagePattern({ cmd: 'createBook' })
  create(@Payload() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @MessagePattern({ cmd: 'findAllBooks' })
  findAll() {
    return this.booksService.findAll();
  }

  @MessagePattern({ cmd: 'findAllBooksIncludingInactive' })
  findAllIncludingInactive() {
    return this.booksService.findAllIncludingInactive();
  }

  @MessagePattern({ cmd: 'findOneBook' })
  findOne(@Payload() id: number) {
    return this.booksService.findOne(id);
  }

  @MessagePattern({ cmd: 'findBookByISBN' })
  findByISBN(@Payload() isbn: string) {
    return this.booksService.findByISBN(isbn);
  }

  @MessagePattern({ cmd: 'updateBook' })
  update(@Payload() data: { id: number; updateBookDto: UpdateBookDto }) {
    return this.booksService.update(data.id, data.updateBookDto);
  }

  @MessagePattern({ cmd: 'removeBook' })
  remove(@Payload() id: number) {
    return this.booksService.remove(id);
  }

  @MessagePattern({ cmd: 'hardDeleteBook' })
  hardDelete(@Payload() id: number) {
    return this.booksService.hardDelete(id);
  }

  @MessagePattern({ cmd: 'updateBookStock' })
  updateStock(@Payload() data: { id: number; quantity: number }) {
    return this.booksService.updateStock(data.id, data.quantity);
  }

  @MessagePattern({ cmd: 'incrementBookStock' })
  incrementStock(@Payload() data: { id: number; quantity: number }) {
    return this.booksService.incrementStock(data.id, data.quantity);
  }

  @MessagePattern({ cmd: 'decrementBookStock' })
  decrementStock(@Payload() data: { id: number; quantity: number }) {
    return this.booksService.decrementStock(data.id, data.quantity);
  }

  @MessagePattern({ cmd: 'searchBooksByTitle' })
  searchByTitle(@Payload() title: string) {
    return this.booksService.searchByTitle(title);
  }

  @MessagePattern({ cmd: 'searchBooksByAuthor' })
  searchByAuthor(@Payload() author: string) {
    return this.booksService.searchByAuthor(author);
  }

  @MessagePattern({ cmd: 'getBooksByYear' })
  getBooksByYear(@Payload() year: number) {
    return this.booksService.getBooksByYear(year);
  }

  @MessagePattern({ cmd: 'getLowStockBooks' })
  getLowStockBooks(@Payload() threshold: number) {
    return this.booksService.getLowStockBooks(threshold);
  }
}