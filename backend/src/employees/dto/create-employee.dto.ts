import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome do funcionário',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'joao.silva@example.com',
    description: 'E-mail do funcionário (deve ser único)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Desenvolvedor de Software',
    description: 'Cargo do funcionário',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    example: 'uuid-da-empresa',
    description: 'ID da empresa à qual o funcionário pertence',
  })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;
}
