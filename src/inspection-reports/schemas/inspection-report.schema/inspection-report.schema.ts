import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

class ChecklistItem {
  @Prop({ required: true })
  checklistGuid: string;

  @Prop({ required: true })
  checklistName: string;

  @Prop({ required: true })
  status: boolean;

  @Prop()
  notes: string;
}

@Schema({ timestamps: true, versionKey: false })
export class InspectionReport extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  guid: string;

  @ApiProperty()
  @Prop({ required: true })
  companyGuid: string;

  @ApiProperty()
  @Prop({ required: true })
  userGuid: string;
  
  @Prop({ required: true })
  employeeGuid: string;

  @Prop({ required: true })
  employeeName: string;

  @Prop({ required: true })
  machineGuid: string;

  @Prop({ required: true })
  machineName: string;

  @Prop({ required: true })
  machineCode: string;

  @Prop({ type: [ChecklistItem], default: [] })
  checklists: ChecklistItem[];

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const InspectionReportSchema =
  SchemaFactory.createForClass(InspectionReport);
