import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MachineAlarm } from './schemas/machine-alarm.schema/machine-alarm.schema';
import { CreateMachineAlarmDto, UpdateMachineAlarmDto } from './dto/create-machine-alarm.dto/create-machine-alarm.dto';
import { ResponseUtil } from 'src/common/response.util';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class MachineAlarmService {
    constructor(@InjectModel(MachineAlarm.name) private machineAlarmModel: Model<MachineAlarm>) {}

    async create(createMachineAlarmDto: CreateMachineAlarmDto): Promise<any> {
        try {
            const guid = `ALARM-${uuidv4()}-${new Date().getFullYear()}`;
            const createdAlarm = new this.machineAlarmModel({
                ...createMachineAlarmDto,
                guid,
            });
            const alarm = await createdAlarm.save();
            return ResponseUtil.success(alarm, 'Machine alarm created successfully');
        } catch (error) {
            console.log(error);
            return ResponseUtil.error(error.message);
        }
    }

    async findAllByMachine(machineGuid: string, page: number = 1, limit: number = 10): Promise<any> {
        try {
            const skip = (page - 1) * limit;
            const alarms = await this.machineAlarmModel.find({ machineGuid })
                .skip(skip)
                .limit(limit)
                .exec();
                
            const total = await this.machineAlarmModel.countDocuments({ machineGuid }).exec();
            
            return ResponseUtil.pagination(
                alarms,
                page,
                limit,
                total,
                'Machine alarms retrieved successfully'
            );
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async findAll(companyGuid: string, page: number = 1, limit: number = 10): Promise<any> {
        try {
            const skip = (page - 1) * limit;
            const alarms = await this.machineAlarmModel.find({ companyGuid })
                .skip(skip)
                .limit(limit)
                .exec();
                
            const total = await this.machineAlarmModel.countDocuments({ companyGuid }).exec();
            
            return ResponseUtil.pagination(
                alarms,
                page,
                limit,
                total,
                'Machine alarms retrieved successfully'
            );
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async findOne(guid: string): Promise<any> {
        try {
            const alarm = await this.machineAlarmModel.findOne({ guid }).exec();
            if (!alarm) {
                return ResponseUtil.notFound('Machine alarm not found');
            }
            return ResponseUtil.success(alarm, 'Machine alarm retrieved successfully');
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async update(guid: string, updateMachineAlarmDto: UpdateMachineAlarmDto): Promise<any> {
        try {
            const alarm = await this.machineAlarmModel.findOneAndUpdate(
                { guid },
                updateMachineAlarmDto,
                { new: true }
            ).exec();
            
            if (!alarm) {
                return ResponseUtil.notFound('Machine alarm not found');
            }
            
            return ResponseUtil.success(alarm, 'Machine alarm updated successfully');
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async remove(guid: string): Promise<any> {
        try {
            const alarm = await this.machineAlarmModel.findOneAndDelete({ guid }).exec();
            if (!alarm) {
                return ResponseUtil.notFound('Machine alarm not found');
            }
            return ResponseUtil.successEmptyResponse('Machine alarm deleted successfully');
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    
}
