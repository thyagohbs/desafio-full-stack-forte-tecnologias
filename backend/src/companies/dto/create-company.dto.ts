import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'O nome da empresa',
    example: 'Forte Tecnologias',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'O CNPJ da empresa (apenas números)',
    example: '12345678000195',
  })
  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  cnpj: string;
}
