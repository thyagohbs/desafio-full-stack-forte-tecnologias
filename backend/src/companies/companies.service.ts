import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  create(createCompanyDto: CreateCompanyDto) {
    return this.companiesRepository.create(createCompanyDto);
  }

  findAll() {
    return this.companiesRepository.findAll();
  }

  findOne(id: string) {
    return this.companiesRepository.findOne(id);
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companiesRepository.update(id, updateCompanyDto);
  }

  remove(id: string) {
    return this.companiesRepository.remove(id);
  }
}
