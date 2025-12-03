import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, Length, IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50, { message: 'El país debe tener entre 2 y 50 caracteres' })
  pais: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean) // Transformación automática
  isActive?: boolean;
}