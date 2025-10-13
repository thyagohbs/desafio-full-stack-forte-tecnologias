export interface Company {
  id: string;
  name: string;
  cnpj: string;
  address: string;
}

export type CreateCompanyDto = Omit<Company, 'id'>;
export type UpdateCompanyDto = Partial<CreateCompanyDto>;
