import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssetsService } from 'src/assets/assets.service';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly assetsService: AssetsService, // Injetar AssetsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo funcionário' })
  @ApiResponse({
    status: 201,
    description: 'Funcionário criado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada.' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os funcionários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de funcionários retornada com sucesso.',
  })
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um funcionário pelo ID' })
  @ApiResponse({ status: 200, description: 'Funcionário encontrado.' })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário atualizado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Funcionário ou empresa não encontrada.',
  })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um funcionário' })
  @ApiResponse({
    status: 204,
    description: 'Funcionário removido com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Get(':id/assets')
  @ApiOperation({
    summary: 'Lista todos os ativos associados a um funcionário',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ativos retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  async findAssetsByEmployee(@Param('id', ParseUUIDPipe) id: string) {
    // Verifica se o funcionário existe
    await this.employeesService.findOne(id);
    return this.assetsService.findAssetsByEmployee(id);
  }
}
