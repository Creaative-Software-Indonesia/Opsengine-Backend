import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InspectionReportService } from './inspection-reports.service';
import { CreateInspectionReportDto, UpdateInspectionReportDto } from './dto/create-inspection-report.dto/create-inspection-report.dto';

@ApiTags('Inspection Reports')
@ApiBearerAuth()
@Controller('inspection-reports')
export class InspectionReportController {
    constructor(private readonly reportService: InspectionReportService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new inspection report' })
    @ApiResponse({ status: 201, description: 'Inspection report created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createReportDto: CreateInspectionReportDto) {
        return this.reportService.create(createReportDto);
    }

    @Get('machine/:machineGuid')
    @ApiOperation({ summary: 'Get all reports for a machine with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({ status: 200, description: 'Inspection reports retrieved successfully.' })
    async findAllByMachine(
        @Param('machineGuid') machineGuid: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.reportService.findAllByMachine(machineGuid, page, limit);
    }

    @Get('employee/:employeeGuid')
    @ApiOperation({ summary: 'Get all reports for an employee with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({ status: 200, description: 'Inspection reports retrieved successfully.' })
    async findAllByEmployee(
        @Param('employeeGuid') employeeGuid: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.reportService.findAllByEmployee(employeeGuid, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an inspection report by ID' })
    @ApiResponse({ status: 200, description: 'Inspection report retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Inspection report not found.' })
    async findOne(@Param('id') id: string) {
        return this.reportService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an inspection report by ID' })
    @ApiResponse({ status: 200, description: 'Inspection report updated successfully.' })
    @ApiResponse({ status: 404, description: 'Inspection report not found.' })
    async update(@Param('id') id: string, @Body() updateReportDto: UpdateInspectionReportDto) {
        return this.reportService.update(id, updateReportDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an inspection report by ID' })
    @ApiResponse({ status: 200, description: 'Inspection report deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Inspection report not found.' })
    async remove(@Param('id') id: string) {
        return this.reportService.remove(id);
    }
}