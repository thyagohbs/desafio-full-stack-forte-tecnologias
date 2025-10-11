import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Forte Tecnologias',
    description: 'Nome da empresa',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://www.fortecnologias.com.br',
    description: 'Website da empresa',
  })
  @IsUrl()
  @IsNotEmpty()
  website: string;
}
