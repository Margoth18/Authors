
import { Type } from "class-transformer";
import {IsString, IsInt, Min, IsISBN, IsBoolean, IsOptional,IsPositive,MaxLength,MinLength,Max,IsNumberString} from "class-validator";

export class UpdateBookDto {
    @IsString()
    @MinLength(2, { message: 'El título debe tener al menos 2 caracteres' })
    @MaxLength(255, { message: 'El título no puede exceder los 255 caracteres' })
    @IsOptional()
    title?: string;

    @IsString()
    @MinLength(2, { message: 'El autor debe tener al menos 2 caracteres' })
    @MaxLength(255, { message: 'El autor no puede exceder los 255 caracteres' })
    @IsOptional()
    author?: string;

    @IsInt()
    @Min(0, { message: 'El año no puede ser negativo' })
    @Max(new Date().getFullYear(), { 
      message: `El año no puede ser mayor a ${new Date().getFullYear()}` 
    })
    @Type(() => Number)
    @IsOptional()
    year?: number;

    @IsString()
    @IsISBN(undefined, { message: 'El ISBN debe ser válido (ISBN-10 o ISBN-13)' })
    @IsOptional()
    isbn?: string;

    @IsInt()
    @IsPositive({ message: 'El stock debe ser un número positivo' })
    @Type(() => Number)
    @IsOptional()
    stock?: number;

    @IsBoolean()
    @Type(() => Boolean)
    @IsOptional()
    isActive?: boolean;
}