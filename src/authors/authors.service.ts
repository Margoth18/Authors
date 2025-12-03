import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/authors.create.dto';
import { UpdateAuthorDto } from './dto/authors.update.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorsService {

    constructor(private readonly prisma: PrismaService) { };

    create(createAuthorDto: CreateAuthorDto) {
        return this.prisma.author.create({
            data: createAuthorDto
        });
    }

    findAll() {
        return this.prisma.author.findMany();
    }

    async findOne(id: number) {
        const author = await this.prisma.author.findUnique({ 
            where: { id } 
        });

        if (!author) {
            throw new NotFoundException(`Autor con ID ${id} no encontrado`);
        }

        return author;
    }

    async update(id: number, updateAuthorDto: UpdateAuthorDto) {

        await this.findOne(id);

        const author = await this.prisma.author.update({
            where: { id },
            data: updateAuthorDto
        });

        return author;
    }

    async remove(id: number) {
        await this.findOne(id);

        const author = await this.prisma.author.delete({ 
            where: { id } 
        });
        
        return author;
    }

}