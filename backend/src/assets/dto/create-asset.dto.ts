import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AssetType } from '../../../generated/prisma';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AssetType)
  @IsNotEmpty()
  type: AssetType;
}
