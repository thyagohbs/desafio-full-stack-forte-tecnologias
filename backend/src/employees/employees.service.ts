import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.repository';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepository: EmployeesRepository) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return this.employeesRepository.create(createEmployeeDto);
  }

  findAll() {
    return this.employeesRepository.findAll();
  }

  findOne(id: string) {
    return this.employeesRepository.findOne(id);
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesRepository.update(id, updateEmployeeDto);
  }

  remove(id: string) {
    return this.employeesRepository.remove(id);
  }
}
