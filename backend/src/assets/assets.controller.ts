import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssignAssetDto } from './dto/assign-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  // ... existing code

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }

  @Post(':id/assign')
  assignAsset(@Param('id') id: string, @Body() assignAssetDto: AssignAssetDto) {
    return this.assetsService.assignAsset(id, assignAssetDto.employeeId);
  }

  @Post(':id/unassign')
  unassignAsset(@Param('id') id: string) {
    return this.assetsService.unassignAsset(id);
  }
}
