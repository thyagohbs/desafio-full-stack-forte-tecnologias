import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.repository';

@Injectable()
export class EmployeesService {
  constructor(private readonly repository: EmployeesRepository) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return this.repository.create(createEmployeeDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const employee = await this.repository.findOne(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(id);
    return this.repository.update(id, updateEmployeeDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  findAllByCompany(companyId: string) {
    return this.repository.findAllByCompany(companyId);
  }
}
