import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceChecklistService } from './maintenance-checklists.service';
import { CreateMaintenanceChecklistDto, UpdateMaintenanceChecklistDto } from './dto/create-maintenance-checklist.dto/create-maintenance-checklist.dto';

@ApiTags('Maintenance Checklists')
@ApiBearerAuth()
@Controller('maintenance-checklists')
export class MaintenanceChecklistController {
    constructor(private readonly checklistService: MaintenanceChecklistService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new maintenance checklist' })
    @ApiResponse({ status: 201, description: 'Maintenance checklist created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createChecklistDto: CreateMaintenanceChecklistDto) {
        return this.checklistService.create(createChecklistDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all maintenance checklists with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({ status: 200, description: 'Maintenance checklists retrieved successfully.' })
    async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.checklistService.findAll(page, limit);
    }

    @Get(':guid')
    @ApiOperation({ summary: 'Get a maintenance checklist by GUID' })
    @ApiResponse({ status: 200, description: 'Maintenance checklist retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Maintenance checklist not found.' })
    async findOne(@Param('guid') guid: string) {
        return this.checklistService.findOne(guid);
    }

    @Put(':guid')
    @ApiOperation({ summary: 'Update a maintenance checklist by GUID' })
    @ApiResponse({ status: 200, description: 'Maintenance checklist updated successfully.' })
    @ApiResponse({ status: 404, description: 'Maintenance checklist not found.' })
    async update(@Param('guid') guid: string, @Body() updateChecklistDto: UpdateMaintenanceChecklistDto) {
        return this.checklistService.update(guid, updateChecklistDto);
    }

    @Delete(':guid')
    @ApiOperation({ summary: 'Delete a maintenance checklist by GUID' })
    @ApiResponse({ status: 200, description: 'Maintenance checklist deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Maintenance checklist not found.' })
    async remove(@Param('guid') guid: string) {
        return this.checklistService.remove(guid);
    }
}