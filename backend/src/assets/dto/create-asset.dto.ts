import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AssetType } from '../../../generated/prisma';

export class CreateAssetDto {
  @ApiProperty({ example: 'Notebook Dell XPS' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: AssetType, example: AssetType.NOTEBOOK })
  @IsEnum(AssetType)
  @IsNotEmpty()
  type: AssetType;
}
