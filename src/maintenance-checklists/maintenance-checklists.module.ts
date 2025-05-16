import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MaintenanceChecklist,
  MaintenanceChecklistSchema,
} from './schemas/maintenance-checklist.schema/maintenance-checklist.schema';
import { MaintenanceChecklistController } from './maintenance-checklists.controller';
import { MaintenanceChecklistService } from './maintenance-checklists.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MaintenanceChecklist.name, schema: MaintenanceChecklistSchema },
    ]),
  ],
  controllers: [MaintenanceChecklistController],
  providers: [MaintenanceChecklistService, JwtAuthGuard, JwtService],
  exports: [MaintenanceChecklistService],
})
export class MaintenanceChecklistModule {}
