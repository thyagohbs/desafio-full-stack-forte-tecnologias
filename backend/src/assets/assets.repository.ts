import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetStatus, AssetType } from '@prisma/client';

@Injectable()
export class AssetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createAssetDto: CreateAssetDto) {
    return this.prisma.asset.create({ data: createAssetDto });
  }

  findAll() {
    return this.prisma.asset.findMany({
      include: {
        assignments: {
          where: { unassignedAt: null },
          include: { employee: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        assignments: {
          where: { unassignedAt: null },
          include: { employee: true },
        },
      },
    });
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.prisma.asset.update({
      where: { id },
      data: updateAssetDto,
    });
  }

  remove(id: string) {
    return this.prisma.asset.delete({ where: { id } });
  }

  async employeeHasAssetType(
    employeeId: string,
    assetType: AssetType,
  ): Promise<boolean> {
    const count = await this.prisma.asset.count({
      where: {
        type: assetType,
        assignments: {
          some: {
            employeeId: employeeId,
            unassignedAt: null,
          },
        },
      },
    });
    return count > 0;
  }

  async findEmployeeWithAssets(employeeId: string) {
    return this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        assignments: {
          where: { unassignedAt: null },
          include: {
            asset: true,
          },
        },
      },
    });
  }

  async findAssetForAssociation(assetId: string) {
    return this.prisma.asset.findUnique({
      where: { id: assetId },
    });
  }

  async assignAssetToEmployee(assetId: string, employeeId: string) {
    return this.prisma.$transaction(async (tx) => {
      const updatedAsset = await tx.asset.update({
        where: { id: assetId },
        data: { status: AssetStatus.EM_USO },
      });

      const assignment = await tx.assetAssignment.create({
        data: {
          assetId,
          employeeId,
        },
      });

      return { updatedAsset, assignment };
    });
  }

  async disassociateAsset(assetId: string) {
    return this.prisma.$transaction(async (tx) => {
      const updatedAsset = await tx.asset.update({
        where: { id: assetId },
        data: { status: AssetStatus.DISPONIVEL },
      });

      const assignment = await tx.assetAssignment.updateMany({
        where: {
          assetId: assetId,
          unassignedAt: null,
        },
        data: {
          unassignedAt: new Date(),
        },
      });

      return { updatedAsset, assignment };
    });
  }

  async findAssetsByEmployeeId(employeeId: string) {
    return this.prisma.asset.findMany({
      where: {
        assignments: {
          some: {
            employeeId: employeeId,
            unassignedAt: null,
          },
        },
      },
    });
  }

  assign(assetId: string, employeeId: string) {
    return this.prisma.$transaction([
      this.prisma.asset.update({
        where: { id: assetId },
        data: { status: AssetStatus.EM_USO },
      }),
      this.prisma.assetAssignment.create({
        data: {
          assetId,
          employeeId,
        },
      }),
    ]);
  }

  unassign(assetId: string) {
    return this.prisma.$transaction([
      this.prisma.asset.update({
        where: { id: assetId },
        data: { status: AssetStatus.DISPONIVEL },
      }),
      this.prisma.assetAssignment.updateMany({
        where: { assetId: assetId, unassignedAt: null },
        data: { unassignedAt: new Date() },
      }),
    ]);
  }
}
