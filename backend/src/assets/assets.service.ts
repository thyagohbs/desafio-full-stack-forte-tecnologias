import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetsRepository } from './assets.repository';
import { AssetStatus, AssetType } from '@prisma/client';
import { EmployeesRepository } from '../employees/employees.repository';

@Injectable()
export class AssetsService {
  constructor(
    private readonly repository: AssetsRepository,
    private readonly employeesRepository: EmployeesRepository,
  ) {}

  create(createAssetDto: CreateAssetDto) {
    return this.repository.create(createAssetDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const asset = await this.repository.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Ativo com ID ${id} não encontrado.`);
    }
    return asset;
  }

  async update(id: string, updateAssetDto: UpdateAssetDto) {
    await this.findOne(id);
    return this.repository.update(id, updateAssetDto);
  }

  async remove(id: string) {
    const asset = await this.findOne(id);

    if (asset.status === AssetStatus.EM_USO) {
      throw new ConflictException('Não é possível remover um ativo em uso.');
    }

    return this.repository.remove(id);
  }

  async assign(assetId: string, employeeId: string) {
    const asset = await this.findOne(assetId);
    if (asset.status !== AssetStatus.DISPONIVEL) {
      throw new BadRequestException('O ativo não está disponível.');
    }

    const employee = await this.employeesRepository.findOne(employeeId);
    if (!employee) {
      throw new NotFoundException(
        `Funcionário com ID ${employeeId} não encontrado.`,
      );
    }

    if (asset.type === AssetType.NOTEBOOK) {
      const hasNotebook = await this.repository.employeeHasAssetType(
        employeeId,
        AssetType.NOTEBOOK,
      );
      if (hasNotebook) {
        throw new BadRequestException(
          'O funcionário já possui um notebook associado.',
        );
      }
    }

    return this.repository.assign(assetId, employeeId);
  }

  async unassign(assetId: string) {
    const asset = await this.findOne(assetId);
    if (asset.status !== AssetStatus.EM_USO) {
      throw new BadRequestException('O ativo não está em uso.');
    }

    return this.repository.unassign(assetId);
  }
}
