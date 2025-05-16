import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, versionKey: false })
export class Machine extends Document {

    @ApiProperty()
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
    name: string;

    @ApiProperty()
    @Prop()
    image: string;

    @ApiProperty()
    @Prop()
    description: string;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);