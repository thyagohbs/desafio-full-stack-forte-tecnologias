import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AssetStatus } from '@prisma/client';

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return this.prisma.employee.create({ data: createEmployeeDto });
  }

  findAll() {
    return this.prisma.employee.findMany({
      include: {
        company: true,
        assignments: {
          where: { unassignedAt: null },
          include: { asset: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
      include: {
        company: true,
        assignments: {
          where: { unassignedAt: null },
          include: { asset: true },
        },
      },
    });
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const assignments = await tx.assetAssignment.findMany({
        where: { employeeId: id, unassignedAt: null },
      });

      if (assignments.length > 0) {
        const assetIds = assignments.map((a) => a.assetId);

        await tx.asset.updateMany({
          where: { id: { in: assetIds } },
          data: { status: AssetStatus.DISPONIVEL },
        });

        await tx.assetAssignment.updateMany({
          where: { id: { in: assignments.map((a) => a.id) } },
          data: { unassignedAt: new Date() },
        });
      }

      return tx.employee.delete({ where: { id } });
    });
  }

  findAllByCompany(companyId: string) {
    return this.prisma.employee.findMany({
      where: { companyId },
    });
  }
}
