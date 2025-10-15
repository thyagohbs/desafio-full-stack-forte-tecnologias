import { IsString, IsUUID } from 'class-validator';

export class DisassociateAssetDto {
  @IsString()
  @IsUUID()
  assetId: string;
}
