import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AlarmHandlingService } from './alarm-handlings.service';
import { CreateAlarmHandlingDto, UpdateAlarmHandlingDto } from './dto/create-alarm-handling.dto/create-alarm-handling.dto';

@ApiTags('Alarm Handlings')
@ApiBearerAuth()
@Controller('alarm-handlings')
export class AlarmHandlingController {
    constructor(private readonly alarmHandlingService: AlarmHandlingService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new alarm handling' })
    @ApiResponse({ status: 201, description: 'Alarm handling created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createAlarmHandlingDto: CreateAlarmHandlingDto) {
        return this.alarmHandlingService.create(createAlarmHandlingDto);
    }

    @Get('alarm/:alarmGuid')
    @ApiOperation({ summary: 'Get all handlings for an alarm with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({ status: 200, description: 'Alarm handlings retrieved successfully.' })
    async findAllByAlarm(
        @Param('alarmGuid') alarmGuid: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.alarmHandlingService.findAllByAlarm(alarmGuid, page, limit);
    }

    @Get(':guid')
    @ApiOperation({ summary: 'Get an alarm handling by GUID' })
    @ApiResponse({ status: 200, description: 'Alarm handling retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Alarm handling not found.' })
    async findOne(@Param('guid') guid: string) {
        return this.alarmHandlingService.findOne(guid);
    }

    @Put(':guid')
    @ApiOperation({ summary: 'Update an alarm handling by GUID' })
    @ApiResponse({ status: 200, description: 'Alarm handling updated successfully.' })
    @ApiResponse({ status: 404, description: 'Alarm handling not found.' })
    async update(@Param('guid') guid: string, @Body() updateAlarmHandlingDto: UpdateAlarmHandlingDto) {
        return this.alarmHandlingService.update(guid, updateAlarmHandlingDto);
    }

    @Delete(':guid')
    @ApiOperation({ summary: 'Delete an alarm handling by GUID' })
    @ApiResponse({ status: 200, description: 'Alarm handling deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Alarm handling not found.' })
    async remove(@Param('guid') guid: string) {
        return this.alarmHandlingService.remove(guid);
    }
}