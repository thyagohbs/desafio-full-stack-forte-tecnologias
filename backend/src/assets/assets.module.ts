import { forwardRef, Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { AssetsRepository } from './assets.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [PrismaModule, forwardRef(() => EmployeesModule)],
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository],
  exports: [AssetsService],
})
export class AssetsModule {}
