import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlarmHandling } from './schemas/alarm-handling.schema/alarm-handling.schema';
import {
  CreateAlarmHandlingDto,
  UpdateAlarmHandlingDto,
} from './dto/create-alarm-handling.dto/create-alarm-handling.dto';
import { ResponseUtil } from 'src/common/response.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlarmHandlingService {
  constructor(
    @InjectModel(AlarmHandling.name)
    private alarmHandlingModel: Model<AlarmHandling>,
  ) {}

  async create(createAlarmHandlingDto: CreateAlarmHandlingDto): Promise<any> {
    try {
      const guid = `DATA-${uuidv4()}-${new Date().getFullYear()}`;
      const createdHandling = new this.alarmHandlingModel({
        ...createAlarmHandlingDto,
        guid,
      });
      const handling = await createdHandling.save();
      return ResponseUtil.success(
        handling,
        'Alarm handling created successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async findAllByAlarm(
    alarmGuid: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const handlings = await this.alarmHandlingModel
        .find({ alarmGuid })
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.alarmHandlingModel
        .countDocuments({ alarmGuid })
        .exec();

      return ResponseUtil.pagination(
        handlings,
        page,
        limit,
        total,
        'Alarm handlings retrieved successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async findOne(guid: string): Promise<any> {
    try {
      const handling = await this.alarmHandlingModel.findOne({ guid }).exec();
      if (!handling) {
        return ResponseUtil.notFound('Alarm handling not found');
      }
      return ResponseUtil.success(
        handling,
        'Alarm handling retrieved successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async update(
    guid: string,
    updateAlarmHandlingDto: UpdateAlarmHandlingDto,
  ): Promise<any> {
    try {
      const handling = await this.alarmHandlingModel
        .findOneAndUpdate({ guid }, updateAlarmHandlingDto, { new: true })
        .exec();

      if (!handling) {
        return ResponseUtil.notFound('Alarm handling not found');
      }

      return ResponseUtil.success(
        handling,
        'Alarm handling updated successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async remove(guid: string): Promise<any> {
    try {
      const handling = await this.alarmHandlingModel
        .findOneAndDelete({ guid })
        .exec();
      if (!handling) {
        return ResponseUtil.notFound('Alarm handling not found');
      }
      return ResponseUtil.successEmptyResponse(
        'Alarm handling deleted successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async findAll(companyGuid: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.alarmHandlingModel.find().skip(skip).limit(limit).exec(),
      this.alarmHandlingModel.countDocuments().exec(),
    ]);

    return {
      success: true,
      message: 'All machine alarms retrieved successfully',
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByMachine(
    companyGuid: string,
    machineGuid: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const query = { companyGuid, machineGuid };

    const [data, total] = await Promise.all([
      this.alarmHandlingModel.find(query).skip(skip).limit(limit).exec(),
      this.alarmHandlingModel.countDocuments(query).exec(),
    ]);

    return {
      success: true,
      message: 'Machine alarms filtered by machineGuid retrieved successfully',
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByAlarm(
    companyGuid: string,
    alarmGuid: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const query = { companyGuid, alarmGuid };

    const [data, total] = await Promise.all([
      this.alarmHandlingModel.find(query).skip(skip).limit(limit).exec(),
      this.alarmHandlingModel.countDocuments(query).exec(),
    ]);

    return {
      success: true,
      message: 'Machine alarms filtered by alarmGuid retrieved successfully',
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByMachineAndAlarm(
    companyGuid: string,
    machineGuid: string,
    alarmGuid: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const query = { companyGuid, machineGuid, alarmGuid };

    const [data, total] = await Promise.all([
      this.alarmHandlingModel.find(query).skip(skip).limit(limit).exec(),
      this.alarmHandlingModel.countDocuments(query).exec(),
    ]);

    return {
      success: true,
      message:
        'Machine alarms filtered by both machineGuid and alarmGuid retrieved successfully',
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
