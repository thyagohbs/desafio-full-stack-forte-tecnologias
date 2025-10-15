import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { AssetsRepository } from './assets.repository';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetStatus, AssetType } from '@prisma/client';
import { AssignAssetDto } from './dto/assign-asset.dto';
import { DisassociateAssetDto } from './dto/disassociate-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly repository: AssetsRepository) {}

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

  async assign(assignAssetDto: AssignAssetDto) {
    const { assetId, employeeId } = assignAssetDto;

    // Busca o ativo e o funcionário (com seus ativos já associados)
    const asset = await this.repository.findAssetForAssociation(assetId);
    const employee = await this.repository.findEmployeeWithAssets(employeeId);

    if (!asset) {
      throw new NotFoundException(`Ativo com ID ${assetId} não encontrado.`);
    }
    if (!employee) {
      throw new NotFoundException(
        `Funcionário com ID ${employeeId} não encontrado.`,
      );
    }
    if (asset.status !== AssetStatus.DISPONIVEL) {
      throw new ConflictException(
        `O ativo '${asset.name}' não está disponível. Status atual: ${asset.status}.`,
      );
    }

    // Um funcionário só pode ter um notebook
    if (asset.type === AssetType.NOTEBOOK) {
      const hasNotebook = employee.assignments.some(
        (assignment) => assignment.asset.type === AssetType.NOTEBOOK,
      );
      if (hasNotebook) {
        throw new ConflictException(
          `O funcionário ${employee.name} já possui um notebook associado.`,
        );
      }
    }

    return this.repository.assignAssetToEmployee(assetId, employeeId);
  }

  async disassociate(disassociateAssetDto: DisassociateAssetDto) {
    const { assetId } = disassociateAssetDto;

    // Valida se o ativo existe
    const asset = await this.repository.findAssetForAssociation(assetId);
    if (!asset) {
      throw new NotFoundException(`Ativo com ID ${assetId} não encontrado.`);
    }

    // Valida se o ativo está realmente em uso
    if (asset.status !== AssetStatus.EM_USO) {
      throw new BadRequestException(
        `O ativo '${asset.name}' não está em uso e não pode ser desassociado.`,
      );
    }

    return this.repository.disassociateAsset(assetId);
  }

  async findAssetsByEmployee(employeeId: string) {
    return this.repository.findAssetsByEmployeeId(employeeId);
  }
}
