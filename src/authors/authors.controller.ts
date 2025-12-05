import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, ParseIntPipe } from '@nestjs/common';

import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/authors.create.dto';
import { UpdateAuthorDto } from './dto/authors.update.dto';

@Controller('authors')
export class AuthorsController {

    constructor(private readonly service: AuthorsService) { }

    @MessagePattern({ cmd: 'authors.findall' })
    findAll() {
        return this.service.findAll();
    }

    @MessagePattern({ cmd: 'authors.findone' })
    findOne(@Payload('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @MessagePattern({ cmd: 'authors.create' })
    create(@Payload() createAuthorDto: CreateAuthorDto) {
        return this.service.create(createAuthorDto);
    }

    @MessagePattern({ cmd: 'authors.update' })
    update(@Payload() updatePayload: { id: string; data: UpdateAuthorDto }) {
        return this.service.update(+updatePayload.id, updatePayload.data);
    }

    @MessagePattern({ cmd: 'authors.delete' })
    delete(@Payload('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}