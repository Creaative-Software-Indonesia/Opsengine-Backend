import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMachineAlarmDto, UpdateMachineAlarmDto } from './dto/create-machine-alarm.dto/create-machine-alarm.dto';
import { MachineAlarmService } from './machine-alarms.service';

@ApiTags('Machine Alarms')
@ApiBearerAuth()
@Controller('machine-alarms')
export class MachineAlarmController {
    constructor(private readonly machineAlarmService: MachineAlarmService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new machine alarm' })
    @ApiResponse({ status: 201, description: 'Machine alarm created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createMachineAlarmDto: CreateMachineAlarmDto) {
        return this.machineAlarmService.create(createMachineAlarmDto);
    }

    @Get('machine/:machineGuid')
    @ApiOperation({ summary: 'Get all alarms for a machine with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({ status: 200, description: 'Machine alarms retrieved successfully.' })
    async findAllByMachine(
        @Param('machineGuid') machineGuid: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.machineAlarmService.findAllByMachine(machineGuid, page, limit);
    }

    @Get(':guid')
    @ApiOperation({ summary: 'Get a machine alarm by GUID' })
    @ApiResponse({ status: 200, description: 'Machine alarm retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Machine alarm not found.' })
    async findOne(@Param('guid') guid: string) {
        return this.machineAlarmService.findOne(guid);
    }

    @Put(':guid')
    @ApiOperation({ summary: 'Update a machine alarm by GUID' })
    @ApiResponse({ status: 200, description: 'Machine alarm updated successfully.' })
    @ApiResponse({ status: 404, description: 'Machine alarm not found.' })
    async update(@Param('guid') guid: string, @Body() updateMachineAlarmDto: UpdateMachineAlarmDto) {
        return this.machineAlarmService.update(guid, updateMachineAlarmDto);
    }

    @Delete(':guid')
    @ApiOperation({ summary: 'Delete a machine alarm by GUID' })
    @ApiResponse({ status: 200, description: 'Machine alarm deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Machine alarm not found.' })
    async remove(@Param('guid') guid: string) {
        return this.machineAlarmService.remove(guid);
    }
}