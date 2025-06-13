import { Module } from '@nestjs/common';
import { CompanySignatureController } from './company-signature.controller';
import { CompanySignatureService } from './company-signature.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CompanySignature,
  CompanySignatureSchema,
} from './entities/company.entity';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanySignature.name, schema: CompanySignatureSchema },
    ]),
  ],
  controllers: [CompanySignatureController],
  providers: [CompanySignatureService,JwtAuthGuard, JwtService],
})
export class CompanySignatureModule {}
