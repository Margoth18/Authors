

import { IsString, IsInt, IsNotEmpty, Min, IsISBN, IsBoolean, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsInt()
  @Min(0)
  year: number;

  @IsString()
  @IsISBN()
  isbn: string;

  @IsInt()
  @Min(1)
  stock: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}