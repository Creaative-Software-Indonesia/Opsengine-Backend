import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, versionKey: false })
export class MachineAlarm extends Document {
    @ApiProperty()
    @Prop({ required: true })
    machineGuid: string;

    @ApiProperty()
    @Prop({ required: true, unique: true })
    guid: string;

    @ApiProperty()
    @Prop({ required: true })
    name: string;

    @ApiProperty()
    @Prop()
    image: string;

    @ApiProperty()
    @Prop()
    description: string;
}

export const MachineAlarmSchema = SchemaFactory.createForClass(MachineAlarm);