import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetsRepository } from './assets.repository';
import { AssetType } from 'generated/prisma';

@Injectable()
export class AssetsService {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  create(createAssetDto: CreateAssetDto) {
    return this.assetsRepository.create(createAssetDto);
  }

  findAll() {
    return this.assetsRepository.findAll();
  }

  findOne(id: string) {
    return this.assetsRepository.findOne(id);
  }

  update(id: string, updateAssetDto: UpdateAssetDto) {
    return this.assetsRepository.update(id, updateAssetDto);
  }

  remove(id: string) {
    return this.assetsRepository.remove(id);
  }

  async assignAsset(assetId: string, employeeId: string) {
    const asset = await this.assetsRepository.findOne(assetId);
    if (!asset) {
      throw new NotFoundException('Ativo não encontrado');
    }

    if (asset.type === AssetType.NOTEBOOK) {
      const employeeHasNotebook =
        await this.assetsRepository.employeeHasAssetType(
          employeeId,
          AssetType.NOTEBOOK,
        );
      if (employeeHasNotebook) {
        throw new ConflictException(
          'Funcionário já possui um notebook associado.',
        );
      }
    }

    return this.assetsRepository.assign(assetId, employeeId);
  }

  async unassignAsset(assetId: string) {
    const asset = await this.assetsRepository.findOne(assetId);
    if (!asset) {
      throw new NotFoundException('Ativo não encontrado');
    }
    return this.assetsRepository.unassign(assetId);
  }
}
