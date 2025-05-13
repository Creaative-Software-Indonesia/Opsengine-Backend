import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceChecklist, MaintenanceChecklistSchema } from './schemas/maintenance-checklist.schema/maintenance-checklist.schema';
import { MaintenanceChecklistController } from './maintenance-checklists.controller';
import { MaintenanceChecklistService } from './maintenance-checklists.service';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: MaintenanceChecklist.name, schema: MaintenanceChecklistSchema }]),
    ],
    controllers: [MaintenanceChecklistController],
    providers: [MaintenanceChecklistService],
    exports: [MaintenanceChecklistService],
})
export class MaintenanceChecklistModule {}