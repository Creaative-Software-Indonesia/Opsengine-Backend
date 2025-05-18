import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MachinesModule } from './machines/machines.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AlarmHandlingModule } from './alarm-handlings/alarm-handlings.module';
import { MaintenanceChecklistModule } from './maintenance-checklists/maintenance-checklists.module';
import { InspectionReportModule } from './inspection-reports/inspection-reports.module';
import { FtpModule } from './ftp/ftp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.DATABASE || 'mongodb://localhost:27017/defaultdb'),
    MachinesModule, MachinesModule, AlarmHandlingModule, MaintenanceChecklistModule, InspectionReportModule, FtpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
