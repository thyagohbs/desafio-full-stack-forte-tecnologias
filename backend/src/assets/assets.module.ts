import { AssetsRepository } from './assets.repository';
import { AssetsController } from './assets.controller';
import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [EmployeesModule],
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository],
})
export class AssetsModule {}
