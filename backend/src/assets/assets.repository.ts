import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetStatus, AssetType } from 'generated/prisma';

@Injectable()
export class AssetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createAssetDto: CreateAssetDto) {
    return this.prisma.asset.create({
      data: createAssetDto,
    });
  }

  findAll() {
    return this.prisma.asset.findMany();
  }

  findOne(id: string) {
    return this.prisma.asset.findUnique({
      where: { id },
    });
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.prisma.asset.update({
      where: { id },
      data: updateAssetDto,
    });
  }

  remove(id: string) {
    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async employeeHasAssetType(
    employeeId: string,
    assetType: AssetType,
  ): Promise<boolean> {
    const count = await this.prisma.asset.count({
      where: {
        type: assetType,
        assignment: {
          employeeId: employeeId,
        },
      },
    });
    return count > 0;
  }

  assign(assetId: string, employeeId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.asset.update({
        where: { id: assetId },
        data: { status: AssetStatus.EM_USO },
      });

      return tx.assetAssignment.create({
        data: {
          assetId,
          employeeId,
        },
      });
    });
  }

  unassign(assetId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.assetAssignment.delete({
        where: { assetId },
      });

      return tx.asset.update({
        where: { id: assetId },
        data: { status: AssetStatus.DISPONIVEL },
      });
    });
  }
}
