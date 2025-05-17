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
import { AlarmHandlingService } from './alarm-handlings.service';
import {
  CreateAlarmHandlingDto,
  UpdateAlarmHandlingDto,
} from './dto/create-alarm-handling.dto/create-alarm-handling.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AuthenticatedRequest } from 'express';

@ApiTags('Alarm Handlings')
@ApiBearerAuth()
@Controller('alarm-handlings')
export class AlarmHandlingController {
  constructor(private readonly alarmHandlingService: AlarmHandlingService) {}

  /**
   *
   * @param createAlarmHandlingDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new alarm handling' })
  @ApiResponse({
    status: 201,
    description: 'Alarm handling created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createAlarmHandlingDto: CreateAlarmHandlingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user: any = req.user;
    const payload = {
      ...createAlarmHandlingDto,
      userGuid: user.guid,
      companyGuid: user.companyGuid,
    };
    return this.alarmHandlingService.create(payload);
  }

  /**
   *
   * @param alarmGuid
   * @param page
   * @param limit
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('alarm/:alarmGuid')
  @ApiOperation({ summary: 'Get all handlings for an alarm with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Alarm handlings retrieved successfully.',
  })
  async findAllByAlarm(
    @Param('alarmGuid') alarmGuid: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.alarmHandlingService.findAllByAlarm(alarmGuid, page, limit);
  }
  /**
   *
   * @param guid
   * @returns
   */
  @Get('/detail/:guid')
  @ApiOperation({ summary: 'Get an alarm handling by GUID' })
  @ApiResponse({
    status: 200,
    description: 'Alarm handling retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Alarm handling not found.' })
  async findOne(@Param('guid') guid: string) {
    return this.alarmHandlingService.findOne(guid);
  }

  /**
   *
   * @param guid
   * @param updateAlarmHandlingDto
   * @returns
   */
  @Put('/update/:guid')
  @ApiOperation({ summary: 'Update an alarm handling by GUID' })
  @ApiResponse({
    status: 200,
    description: 'Alarm handling updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Alarm handling not found.' })
  async update(
    @Param('guid') guid: string,
    @Body() updateAlarmHandlingDto: UpdateAlarmHandlingDto,
  ) {
    return this.alarmHandlingService.update(guid, updateAlarmHandlingDto);
  }

  /**
   *
   * @param guid
   * @returns
   */
  @Delete('/delete/:guid')
  @ApiOperation({ summary: 'Delete an alarm handling by GUID' })
  @ApiResponse({
    status: 200,
    description: 'Alarm handling deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Alarm handling not found.' })
  async remove(@Param('guid') guid: string) {
    return this.alarmHandlingService.remove(guid);
  }

    /**
     *
     * @param guid
     * @returns
     */

    @Get('filter')
    @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get machine alarms with optional filters' })
  @ApiQuery({ name: 'machineGuid', required: false, type: String })
  @ApiQuery({ name: 'alarmGuid', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Machine alarms retrieved successfully.',
    })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('machineGuid') machineGuid?: string,
    @Query('alarmGuid') alarmGuid?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {

    const user: any = req.user;
    const companyGuid = user.companyGuid;
    if (machineGuid && alarmGuid) {
      return this.alarmHandlingService.findByMachineAndAlarm(companyGuid,machineGuid, alarmGuid, page, limit);
    }
    if (machineGuid) {
      return this.alarmHandlingService.findByMachine(companyGuid,machineGuid, page, limit);
    }
    if (alarmGuid) {
      return this.alarmHandlingService.findByAlarm(companyGuid, alarmGuid, page, limit);
    }
    return this.alarmHandlingService.findAll(companyGuid, page, limit);
  }
}
