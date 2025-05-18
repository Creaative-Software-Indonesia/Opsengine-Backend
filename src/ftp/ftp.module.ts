import { Module } from '@nestjs/common';
import { FtpService } from './ftp.service';
import { FtpController } from './ftp.controller';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [FtpService, JwtAuthGuard, JwtService],
  controllers: [FtpController]
})
export class FtpModule { }
