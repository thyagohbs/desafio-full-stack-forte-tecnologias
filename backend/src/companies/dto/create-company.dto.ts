import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Forte Tecnologias' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
