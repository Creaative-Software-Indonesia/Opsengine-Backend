import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class AlarmHandling extends Document {
  @Prop({ required: true, unique: true })
  guid: string;

  @Prop({ required: true })
  companyGuid: string;

  @Prop({ required: true })
  userGuid: string;

  @Prop({ required: true })
  machineGuid: string;

  @Prop({ required: true })
  alarmGuid: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;
}

export const AlarmHandlingSchema = SchemaFactory.createForClass(AlarmHandling);
