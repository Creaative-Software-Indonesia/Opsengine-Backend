import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class CompanySignature extends Document {
  @Prop({ required: true, unique: true })
  guid: string;

  @Prop({ required: true, unique: true })
  companyGuid: string;

  @Prop()
  companyLogo?: string;

  @Prop()
  companyName?: string;

  @Prop({
    type: [{
      userGuid: { type: String, required: true },
      fullName: { type: String, required: true },
      signatureImage: { type: String },
      position: { type: String },
      isActive: { type: Boolean, default: true }
    }],
    default: [] // Inisialisasi sebagai array kosong
  })
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

export const CompanySignatureSchema = SchemaFactory.createForClass(CompanySignature);