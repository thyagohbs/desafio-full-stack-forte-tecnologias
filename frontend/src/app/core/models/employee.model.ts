export interface Employee {
  id: string;
  name: string;
  email: string;
  cpf: string;
  companyId: string;
}

export type CreateEmployeeDto = Omit<Employee, 'id'>;
export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;
