import { IsNotEmpty, IsUUID } from 'class-validator';

export class UnassignAssetDto {
  @IsUUID()
  @IsNotEmpty()
  assetId: string;
}
