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
import { MaintenanceChecklistService } from './maintenance-checklists.service';
import {
  CreateMaintenanceChecklistDto,
  UpdateMaintenanceChecklistDto,
} from './dto/create-maintenance-checklist.dto/create-maintenance-checklist.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AuthenticatedRequest } from 'express';

@ApiTags('Maintenance Checklists')
@ApiBearerAuth()
@Controller('maintenance-checklists')
export class MaintenanceChecklistController {
  constructor(private readonly checklistService: MaintenanceChecklistService) {}
  /**
   *
   * @param createChecklistDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new maintenance checklist' })
  @ApiResponse({
    status: 201,
    description: 'Maintenance checklist created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createChecklistDto: CreateMaintenanceChecklistDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user: any = req.user;
    const payload = {
      ...createChecklistDto,
      userGuid: user.guid,
      companyGuid: user.companyGuid,
    };
    return this.checklistService.create(payload);
  }
  /**
   *
   * @param page
   * @param limit
   * @returns
   */

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all maintenance checklists with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Maintenance checklists retrieved successfully.',
  })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const user: any = req.user;
    const companyGuid = user.companyGuid;
    return this.checklistService.findAll(companyGuid, page, limit);
  }
  /**
   *
   * @param req
   * @param machineGuid
   * @param page
   * @param limit
   * @returns
   */
  @Get('filter')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get maintenance checklists with optional filters and pagination',
  })
  @ApiQuery({
    name: 'machineGuid',
    required: false,
    type: String,
    description: 'Filter by machine GUID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Maintenance checklists retrieved successfully.',
  })
  async findAllByCompany(
    @Req() req: AuthenticatedRequest,
    @Query('machineGuid') machineGuid?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const user: any = req.user;
    const companyGuid = user.companyGuid;

    if (machineGuid) {
      return this.checklistService.findByMachine(
        companyGuid,
        machineGuid,
        page,
        limit,
      );
    }
    return this.checklistService.findAll(companyGuid, page, limit);
  }
  /**
   *
   * @param guid
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/detail/:guid')
  @ApiOperation({ summary: 'Get a maintenance checklist by GUID' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance checklist retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Maintenance checklist not found.' })
  async findOne(@Param('guid') guid: string) {
    return this.checklistService.findOne(guid);
  }

  /**
   *
   * @param guid
   * @param updateChecklistDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/update/:guid')
  @ApiOperation({ summary: 'Update a maintenance checklist by GUID' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance checklist updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Maintenance checklist not found.' })
  async update(
    @Param('guid') guid: string,
    @Body() updateChecklistDto: UpdateMaintenanceChecklistDto,
  ) {
    return this.checklistService.update(guid, updateChecklistDto);
  }
  /**
   *
   * @param guid
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:guid')
  @ApiOperation({ summary: 'Delete a maintenance checklist by GUID' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance checklist deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Maintenance checklist not found.' })
  async remove(@Param('guid') guid: string) {
    return this.checklistService.remove(guid);
  }
}
