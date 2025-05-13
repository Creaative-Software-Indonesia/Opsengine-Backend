import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class MaintenanceChecklist extends Document {
    @Prop({ required: true, unique: true })
    guid: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    image: string;

    @Prop()
    description: string;
}

export const MaintenanceChecklistSchema = SchemaFactory.createForClass(MaintenanceChecklist);