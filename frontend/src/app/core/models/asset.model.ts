export enum AssetType {
  NOTEBOOK = 'NOTEBOOK',
  MONITOR = 'MONITOR',
  DESKTOP = 'DESKTOP',
  KEYBOARD = 'KEYBOARD',
  MOUSE = 'MOUSE',
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  description?: string;
  employeeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetDto {
  name: string;
  type: AssetType;
  description?: string;
}

export type UpdateAssetDto = Partial<CreateAssetDto>;

export interface AssignAssetDto {
  employeeId: string;
}
