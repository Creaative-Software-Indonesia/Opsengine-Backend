import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Req } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseUtil } from '../common/response.util';
import { CreateMachineDto } from './dto/create-machine.dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto/update-machine.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AuthenticatedRequest } from 'express';

@ApiTags('Machines')
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new machine' })
  @ApiResponse({ status: 201, description: 'Machine created successfully' })
  async create(@Body() createMachineDto: CreateMachineDto, @Req() req: AuthenticatedRequest) {
    const user:any = req.user ;
    const payload ={
      ...createMachineDto,
      userGuid: user.guid,
      companyGuid:user.companyGuid
    }
    const machine = await this.machinesService.create(payload);
    return ResponseUtil.success(machine, 'Machine created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all machines' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of machines' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    const { data, total } = await this.machinesService.findAll(page, limit);
    return ResponseUtil.pagination(data, page, limit, total);
  }

  @Get(':guid')
  @ApiOperation({ summary: 'Get a machine by GUID' })
  @ApiResponse({ status: 200, description: 'Machine details' })
  @ApiResponse({ status: 404, description: 'Machine not found' })
  async findOne(@Param('guid') guid: string) {
    const machine = await this.machinesService.findOne(guid);
    if (!machine) {
      return ResponseUtil.notFound('Machine not found');
    }
    return ResponseUtil.success(machine);
  }

  @Put(':guid')
  @ApiOperation({ summary: 'Update a machine' })
  @ApiResponse({ status: 200, description: 'Machine updated successfully' })
  @ApiResponse({ status: 404, description: 'Machine not found' })
  async update(@Param('guid') guid: string, @Body() updateMachineDto: UpdateMachineDto) {
    const machine = await this.machinesService.update(guid, updateMachineDto);
    if (!machine) {
      return ResponseUtil.notFound('Machine not found');
    }
    return ResponseUtil.success(machine, 'Machine updated successfully');
  }

  @Delete(':guid')
  @ApiOperation({ summary: 'Delete a machine' })
  @ApiResponse({ status: 200, description: 'Machine deleted successfully' })
  @ApiResponse({ status: 404, description: 'Machine not found' })
  async remove(@Param('guid') guid: string) {
    const machine = await this.machinesService.remove(guid);
    if (!machine) {
      return ResponseUtil.notFound('Machine not found');
    }
    return ResponseUtil.success({}, 'Machine deleted successfully');
  }
}