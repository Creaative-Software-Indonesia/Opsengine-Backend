import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InspectionReportService } from './inspection-reports.service';
import {
  CreateInspectionReportDto,
  UpdateInspectionReportDto,
} from './dto/create-inspection-report.dto/create-inspection-report.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AuthenticatedRequest } from 'express';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Inspection Reports')
@ApiBearerAuth()
@Controller('inspection-reports')
export class InspectionReportController {
  constructor(private readonly reportService: InspectionReportService) { }

  /**
   *
   * @param createReportDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new inspection report' })
  @ApiResponse({
    status: 201,
    description: 'Inspection report created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createReportDto: CreateInspectionReportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const guid = `REPORT-${uuidv4()}-${new Date().getFullYear()}`;
    const user: any = req.user;
    const payload = {
      ...createReportDto,
      guid,
      companyGuid: user.companyGuid,
      userGuid: user.guid,
      employeeGuid: user.guid,
      employeeName: user.name,
    };
    return this.reportService.create(payload);
  }
  /**
   *
   * @param machineGuid
   * @param page
   * @param limit
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('machine/:machineGuid')
  @ApiOperation({ summary: 'Get all reports for a machine with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Inspection reports retrieved successfully.',
  })
  async findAllByMachine(
    @Param('machineGuid') machineGuid: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reportService.findAllByMachine(machineGuid, page, limit);
  }

  /**
   *
   * @param employeeGuid
   * @param page
   * @param limit
   * @returns
   */

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('employee')
  @ApiOperation({ summary: 'Get all reports for an employee with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Inspection reports retrieved successfully.',
  })
  async findAllByEmployee(
    @Req() req: AuthenticatedRequest,
    // @Param('employeeGuid') employeeGuid: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const user: any = req.user;
    const employeeGuid = user.guid;
    return this.reportService.findByEmployee(employeeGuid, page, limit);
  }

  /**
   * 
   * @param guid 
   * @returns 
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('detail/:guid')
  @ApiOperation({ summary: 'Get an inspection report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Inspection report retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Inspection report not found.' })
  async findOne(@Param('guid') guid: string) {
    return this.reportService.findOne(guid);
  }

  /**
   * 
   * @param guid 
   * @param updateReportDto 
   * @returns 
   */

  @Put('/update/:guid')
  @ApiOperation({ summary: 'Update an inspection report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Inspection report updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Inspection report not found.' })
  async update(
    @Param('guid') guid: string,
    @Body() updateReportDto: UpdateInspectionReportDto,
  ) {
    return this.reportService.update(guid, updateReportDto);
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:guid')
  @ApiOperation({ summary: 'Delete an inspection report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Inspection report deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Inspection report not found.' })
  async remove(@Param('guid') guid: string) {
    return this.reportService.remove(guid);
  }
}
