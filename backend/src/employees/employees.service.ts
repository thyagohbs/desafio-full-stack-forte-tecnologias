import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.repository';
import { CompaniesRepository } from '../companies/companies.repository';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly repository: EmployeesRepository,
    private readonly companiesRepository: CompaniesRepository,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const company = await this.companiesRepository.findOne(
      createEmployeeDto.companyId,
    );
    if (!company) {
      throw new NotFoundException(
        `Empresa com ID ${createEmployeeDto.companyId} não encontrada.`,
      );
    }
    return this.repository.create(createEmployeeDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const employee = await this.repository.findOne(id);
    if (!employee) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado.`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(id);
    if (updateEmployeeDto.companyId) {
      const company = await this.companiesRepository.findOne(
        updateEmployeeDto.companyId,
      );
      if (!company) {
        throw new NotFoundException(
          `Empresa com ID ${updateEmployeeDto.companyId} não encontrada.`,
        );
      }
    }
    return this.repository.update(id, updateEmployeeDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
