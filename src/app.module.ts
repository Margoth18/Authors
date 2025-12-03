import { Module } from '@nestjs/common';
import { AuthorsService } from './authors/authors.service';
import { AuthorsController } from './authors/authors.controller';
import { AuthorsModule } from './authors/authors.module';


@Module({
  imports: [AuthorsModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
})
export class AppModule {}

