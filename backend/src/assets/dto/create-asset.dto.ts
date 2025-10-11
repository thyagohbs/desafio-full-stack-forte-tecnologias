import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({
    example: 'Notebook Dell XPS 15',
    description: 'Nome do ativo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Notebook de alta performance para desenvolvimento',
    description: 'Descrição do ativo',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'XPS-15-9510', description: 'Modelo do ativo' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    example: 'Em uso',
    description: 'Status do ativo (ex: Em uso, Em estoque, Em manutenção)',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    example: 95,
    description: 'Nível de saúde do ativo (0-100)',
  })
  @IsInt()
  @Min(0)
  @Max(100)
  healthLevel: number;

  @ApiProperty({
    example: 'uuid-do-funcionario',
    description: 'ID do funcionário ao qual o ativo está associado',
    required: false,
  })
  @IsString()
  @IsOptional()
  employeeId?: string;
}
