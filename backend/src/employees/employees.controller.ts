import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo funcionário' })
  @ApiResponse({
    status: 201,
    description: 'O funcionário foi criado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os funcionários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de funcionários retornada com sucesso.',
  })
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um funcionário pelo ID' })
  @ApiResponse({ status: 200, description: 'Funcionário encontrado.' })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário removido com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.remove(id);
  }
}
