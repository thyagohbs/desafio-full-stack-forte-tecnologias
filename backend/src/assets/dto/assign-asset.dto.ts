import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignAssetDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'ID do funcionário',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  employeeId: string;
}
