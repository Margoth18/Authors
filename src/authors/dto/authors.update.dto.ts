import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, Length, IsNotEmpty,ValidateIf } from 'class-validator';

export class UpdateAuthorDto {
  @ValidateIf(o => o.nombre !== undefined)
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre?: string;

  @ValidateIf(o => o.pais !== undefined)
  @IsString()
  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  @Length(2, 50, { message: 'El país debe tener entre 2 y 50 caracteres' })
  pais?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean) 
  isActive?: boolean;
}