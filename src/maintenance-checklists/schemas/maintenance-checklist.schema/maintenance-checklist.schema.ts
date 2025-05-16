import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class MaintenanceChecklist extends Document {
  @Prop({ required: true, unique: true })
  guid: string;

  @ApiProperty()
  @Prop({ required: true })
  companyGuid: string;

  @ApiProperty()
  @Prop({ required: true })
  userGuid: string;

  @ApiProperty()
  @Prop({ required: true })
  machineGuid: string;
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;
}

export const MaintenanceChecklistSchema =
  SchemaFactory.createForClass(MaintenanceChecklist);
