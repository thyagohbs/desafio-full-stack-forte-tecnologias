import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Nome do funcionário', example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'E-mail do funcionário',
    example: 'joao.silva@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'CPF do funcionário (apenas números)',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;

  @ApiProperty({ description: 'ID da empresa à qual o funcionário pertence' })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;
}
