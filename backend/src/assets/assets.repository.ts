import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
