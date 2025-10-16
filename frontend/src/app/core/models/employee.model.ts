import { Company } from './company.model';

export interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  cpf: string;
  companyId: string;
}

export type UpdateEmployeeDto = Partial<Omit<CreateEmployeeDto, 'companyId'>>;
