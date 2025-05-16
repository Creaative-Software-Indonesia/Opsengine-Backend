import { Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Machine, MachineSchema } from './schemas/machine.schema/machine.schema';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Machine.name, schema: MachineSchema }]),
  ],
  controllers: [MachinesController],
  providers: [MachinesService,JwtAuthGuard, JwtService],
  exports: [MachinesService],
})
export class MachinesModule { }