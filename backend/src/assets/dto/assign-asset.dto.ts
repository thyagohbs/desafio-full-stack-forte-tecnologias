import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignAssetDto {
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;
}
