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
import {
    CreateMachineAlarmDto,
    UpdateMachineAlarmDto,
} from './dto/create-machine-alarm.dto/create-machine-alarm.dto';
import { MachineAlarmService } from './machine-alarms.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AuthenticatedRequest } from 'express';

@ApiTags('Machine Alarms')
@ApiBearerAuth()
@Controller('machine-alarms')
export class MachineAlarmController {
    constructor(private readonly machineAlarmService: MachineAlarmService) { }

    /**
     *
     * @param createMachineAlarmDto
     * @param req
     * @returns
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('/create')
    @ApiOperation({ summary: 'Create a new machine alarm' })
    @ApiResponse({
        status: 201,
        description: 'Machine alarm created successfully.',
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(
        @Body() createMachineAlarmDto: CreateMachineAlarmDto,
        @Req() req: AuthenticatedRequest,
    ) {
        const user: any = req.user;
        const payload = {
            ...createMachineAlarmDto,
            userGuid: user.guid,
            companyGuid: user.companyGuid,
        };
        return this.machineAlarmService.create(payload);
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
    @ApiOperation({ summary: 'Get all alarms for a machine with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Machine alarms retrieved successfully.',
    })
    async findAllByMachine(
        @Param('machineGuid') machineGuid: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.machineAlarmService.findAllByMachine(machineGuid, page, limit);
    }

    /**
     *
     * @param guid
     * @returns
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('detaill/:guid')
    @ApiOperation({ summary: 'Get a machine alarm by GUID' })
    @ApiResponse({
        status: 200,
        description: 'Machine alarm retrieved successfully.',
    })
    @ApiResponse({ status: 404, description: 'Machine alarm not found.' })
    async findOne(@Param('guid') guid: string) {
        return this.machineAlarmService.findOne(guid);
    }

    /**
     * Get all machine alarms with optional machineGuid filter and pagination
     * @param machineGuid - Optional machine GUID to filter by
     * @param page - Page number
     * @param limit - Items per page
     * @returns Paginated list of machine alarms
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('filter')
    @ApiOperation({
        summary: 'Get all machine alarms with optional machineGuid filter and pagination'
    })
    @ApiQuery({
        name: 'machineGuid',
        required: false,
        type: String,
        description: 'Optional machine GUID to filter alarms'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number'
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Items per page'
    })
    @ApiResponse({
        status: 200,
        description: 'Machine alarms retrieved successfully.',
    })
    async findAll(
        @Req() req: AuthenticatedRequest,
        @Query('machineGuid') machineGuid?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
       
    ) {
        const user: any = req.user;
        const companyGuid = user.companyGuid;
        if (machineGuid) {
            return this.machineAlarmService.findAllByMachine(machineGuid, page, limit);
        }
        return this.machineAlarmService.findAll(companyGuid,page, limit);
    }

    /**
     *
     * @param guid
     * @param updateMachineAlarmDto
     * @returns
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('update/:guid')
    @ApiOperation({ summary: 'Update a machine alarm by GUID' })
    @ApiResponse({
        status: 200,
        description: 'Machine alarm updated successfully.',
    })
    @ApiResponse({ status: 404, description: 'Machine alarm not found.' })
    async update(
        @Param('guid') guid: string,
        @Body() updateMachineAlarmDto: UpdateMachineAlarmDto,
    ) {
        return this.machineAlarmService.update(guid, updateMachineAlarmDto);
    }

    /**
     *
     * @param guid
     * @returns
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:guid')
    @ApiOperation({ summary: 'Delete a machine alarm by GUID' })
    @ApiResponse({
        status: 200,
        description: 'Machine alarm deleted successfully.',
    })
    @ApiResponse({ status: 404, description: 'Machine alarm not found.' })
    async remove(@Param('guid') guid: string) {
        return this.machineAlarmService.remove(guid);
    }
}
