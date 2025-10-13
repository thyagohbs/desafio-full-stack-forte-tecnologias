export interface Asset {
  id: string;
  name: string;
  type: 'Notebook' | 'Monitor' | 'Celular';
  status: 'Disponível' | 'Em Uso' | 'Em Manutenção';
  employeeId?: string;
}

export type CreateAssetDto = Omit<Asset, 'id' | 'status' | 'employeeId'>;
export type UpdateAssetDto = Partial<CreateAssetDto>;
