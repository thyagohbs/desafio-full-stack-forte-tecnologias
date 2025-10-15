import { forwardRef, Module } from '@nestjs/common';
import { AssetsModule } from 'src/assets/assets.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './employees.repository';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AssetsModule), CompaniesModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
  exports: [EmployeesService],
})
export class EmployeesModule {}
