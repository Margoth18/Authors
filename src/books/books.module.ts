
import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controllers';

@Module({
  imports: [],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService], 
})
export class BooksModule {}