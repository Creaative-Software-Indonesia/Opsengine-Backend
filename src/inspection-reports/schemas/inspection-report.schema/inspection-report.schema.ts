import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class ChecklistItem {
    @Prop({ required: true })
    checklistGuid: string;

    @Prop({ required: true })
    status: boolean;

    @Prop()
    notes: string;
}

@Schema({ timestamps: true,versionKey:false })
export class InspectionReport extends Document {
    @Prop({ required: true })
    employeeGuid: string;

    @Prop({ required: true })
    employeeName: string;

    @Prop({ required: true })
    machineGuid: string;

    @Prop({ type: [ChecklistItem], default: [] })
    checklists: ChecklistItem[];

    @Prop({ required: true, default: Date.now })
    date: Date;
}

export const InspectionReportSchema = SchemaFactory.createForClass(InspectionReport);