import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly repository: CompaniesRepository) {}

  create(createCompanyDto: CreateCompanyDto) {
    return this.repository.create(createCompanyDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const company = await this.repository.findOne(id);
    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);
    return this.repository.update(id, updateCompanyDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
