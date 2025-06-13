import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class CompanySignature extends Document {
  @Prop({ required: true, unique: true })
  companyGuid: string;
  @Prop()
  companyLogo?: string;
  employees: {
    userGuid: string;
    fullName: string;
    signatureImage?: string;
    position?: string;
    isActive: boolean;
  }[];

  @Prop({ default: true })
  isActive: boolean;
}

export const CompanySignatureSchema =
  SchemaFactory.createForClass(CompanySignature);
