import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssignAssetDto } from './dto/assign-asset.dto';
import { DisassociateAssetDto } from './dto/disassociate-asset.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo ativo' })
  @ApiResponse({ status: 201, description: 'O ativo foi criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ativos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ativos retornada com sucesso.',
  })
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um ativo pelo ID' })
  @ApiResponse({ status: 200, description: 'Ativo retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ativo não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um ativo' })
  @ApiResponse({ status: 200, description: 'Ativo atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ativo não encontrado.' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um ativo' })
  @ApiResponse({ status: 204, description: 'Ativo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ativo não encontrado.' })
  remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }

  @Post('assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Associa um ativo a um funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Ativo associado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ativo ou funcionário não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflito de regra de negócio (ex: ativo não disponível ou funcionário já possui notebook).',
  })
  assign(@Body() assignAssetDto: AssignAssetDto) {
    return this.assetsService.assign(assignAssetDto);
  }

  @Post('disassociate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desassocia um ativo de um funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Ativo desassociado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Ativo não encontrado.' })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida (ex: ativo não está em uso).',
  })
  disassociate(@Body() disassociateAssetDto: DisassociateAssetDto) {
    return this.assetsService.disassociate(disassociateAssetDto);
  }
}
