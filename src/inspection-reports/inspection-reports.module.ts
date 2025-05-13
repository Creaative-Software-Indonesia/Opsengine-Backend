import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InspectionReport, InspectionReportSchema } from './schemas/inspection-report.schema/inspection-report.schema';
import { MaintenanceChecklistModule } from 'src/maintenance-checklists/maintenance-checklists.module';
import { InspectionReportController } from './inspection-reports.controller';
import { InspectionReportService } from './inspection-reports.service';
import { MachinesModule } from 'src/machines/machines.module';



@Module({
    imports: [
        MongooseModule.forFeature([{ name: InspectionReport.name, schema: InspectionReportSchema }]),
        MachinesModule,
        MaintenanceChecklistModule,
    ],
    controllers: [InspectionReportController],
    providers: [InspectionReportService],
    exports: [InspectionReportService],
})
export class InspectionReportModule {}