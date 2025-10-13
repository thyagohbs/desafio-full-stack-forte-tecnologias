export interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  position: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  cpf: string;
  position: string;
  companyId: string;
}

export type UpdateEmployeeDto = Partial<Omit<CreateEmployeeDto, 'companyId'>>;
