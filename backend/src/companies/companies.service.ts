import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly repository: CompaniesRepository) {}

  create(createCompanyDto: CreateCompanyDto) {
    // Aqui poderiam entrar regras de negócio, como verificar se o CNPJ já existe.
    return this.repository.create(createCompanyDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const company = await this.repository.findOne(id);
    if (!company) {
      throw new NotFoundException(`Company with ID "${id}" not found`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id); // Garante que a empresa existe antes de atualizar
    return this.repository.update(id, updateCompanyDto);
  }

  async remove(id: string) {
    await this.findOne(id); // Garante que a empresa existe antes de remover
    return this.repository.remove(id);
  }
}
