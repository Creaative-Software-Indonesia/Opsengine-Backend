import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InspectionReport } from './schemas/inspection-report.schema/inspection-report.schema';
import { CreateInspectionReportDto, UpdateInspectionReportDto } from './dto/create-inspection-report.dto/create-inspection-report.dto';
import { ResponseUtil } from 'src/common/response.util';

@Injectable()
export class InspectionReportService {
    constructor(@InjectModel(InspectionReport.name) private reportModel: Model<InspectionReport>) { }

    async create(createReportDto: CreateInspectionReportDto): Promise<any> {
        try {
            const createdReport = new this.reportModel({
                ...createReportDto,
                date: createReportDto.date || new Date(),
            });
            const report = await createdReport.save();
            return ResponseUtil.success(report, 'Inspection report created successfully');
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async findAllByMachine(machineGuid: string, page: number = 1, limit: number = 10): Promise<any> {
        try {
            if (page < 1) page = 1;
            const skip = (page - 1) * limit;
            const reports = await this.reportModel.find({ machineGuid })
                .skip(skip)
                .limit(limit)
                .sort({ date: -1 })
                .exec();

            const total = await this.reportModel.countDocuments({ machineGuid }).exec();

            return ResponseUtil.pagination(
                reports,
                page,
                limit,
                total,
                'Inspection reports retrieved successfully'
            );
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async findByEmployee(employeeGuid: string, page: number = 1, limit: number = 10): Promise<any> {
        try {
            if (page < 1) page = 1;
            const skip = (page - 1) * limit;
            const reports = await this.reportModel.find({ employeeGuid })
                .skip(skip)
                .limit(limit)
                .sort({ date: -1 })
                .exec();

            const total = await this.reportModel.countDocuments({ employeeGuid }).exec();

            return ResponseUtil.pagination(
                reports,
                page,
                limit,
                total,
                'Inspection reports retrieved successfully'
            );
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async findOne(guid: string): Promise<any> {
        try {
            const report = await this.reportModel.findOne({guid}).exec();
            if (!report) {
                return ResponseUtil.notFound('Inspection report not found');
            }
            return ResponseUtil.success(report, 'Inspection report retrieved successfully');
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async update(guid: string, updateReportDto: UpdateInspectionReportDto): Promise<any> {
        try {
            const report = await this.reportModel.findOneAndUpdate(
                { guid },
                updateReportDto,
                { new: true }
            ).exec();

            if (!report) {
                return ResponseUtil.notFound('Inspection report not found');
            }

            return ResponseUtil.success(report, 'Inspection report updated successfully');
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }

    async remove(guid: string): Promise<any> {
        try {
            const report = await this.reportModel.findOneAndDelete({guid}).exec();
            if (!report) {
                return ResponseUtil.notFound('Inspection report not found');
            }
            return ResponseUtil.successEmptyResponse('Inspection report deleted successfully');
        } catch (error) {
            return ResponseUtil.error(error.message);
        }
    }
}
