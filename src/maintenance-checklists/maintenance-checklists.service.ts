import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaintenanceChecklist } from './schemas/maintenance-checklist.schema/maintenance-checklist.schema';
import {
  CreateMaintenanceChecklistDto,
  UpdateMaintenanceChecklistDto,
} from './dto/create-maintenance-checklist.dto/create-maintenance-checklist.dto';
import { ResponseUtil } from 'src/common/response.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MaintenanceChecklistService {
  constructor(
    @InjectModel(MaintenanceChecklist.name)
    private checklistModel: Model<MaintenanceChecklist>,
  ) {}

  async create(
    createChecklistDto: CreateMaintenanceChecklistDto,
  ): Promise<any> {
    try {
      const guid = `FORM-${uuidv4()}-${new Date().getFullYear()}`;
      const createdChecklist = new this.checklistModel({
        ...createChecklistDto,
        guid,
      });
      const checklist = await createdChecklist.save();
      return ResponseUtil.success(
        checklist,
        'Maintenance checklist created successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async findAll(
    companyGuid: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const checklists = await this.checklistModel
        .find({ companyGuid })
        .skip(skip)
        .limit(limit)
        .exec();
      const total = await this.checklistModel
        .countDocuments({ companyGuid })
        .exec();

      return ResponseUtil.pagination(
        checklists,
        page,
        limit,
        total,
        'Maintenance checklists retrieved successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async findOne(guid: string): Promise<any> {
    try {
      const checklist = await this.checklistModel.findOne({ guid }).exec();
      if (!checklist) {
        return ResponseUtil.notFound('Maintenance checklist not found');
      }
      return ResponseUtil.success(
        checklist,
        'Maintenance checklist retrieved successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async update(
    guid: string,
    updateChecklistDto: UpdateMaintenanceChecklistDto,
  ): Promise<any> {
    try {
      const checklist = await this.checklistModel
        .findOneAndUpdate({ guid }, updateChecklistDto, { new: true })
        .exec();

      if (!checklist) {
        return ResponseUtil.notFound('Maintenance checklist not found');
      }

      return ResponseUtil.success(
        checklist,
        'Maintenance checklist updated successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async remove(guid: string): Promise<any> {
    try {
      const checklist = await this.checklistModel
        .findOneAndDelete({ guid })
        .exec();
      if (!checklist) {
        return ResponseUtil.notFound('Maintenance checklist not found');
      }
      return ResponseUtil.successEmptyResponse(
        'Maintenance checklist deleted successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
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
      this.checklistModel.find(query).skip(skip).limit(limit).exec(),
      this.checklistModel.countDocuments(query).exec(),
    ]);

    return {
      success: true,
      message:
        'Maintenance checklists filtered by machine retrieved successfully',
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
