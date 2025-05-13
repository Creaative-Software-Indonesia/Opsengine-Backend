import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MachineAlarm, MachineAlarmSchema } from './schemas/machine-alarm.schema/machine-alarm.schema';
import { MachineAlarmController } from './machine-alarms.controller';
import { MachineAlarmService } from './machine-alarms.service';
import { MachinesModule } from 'src/machines/machines.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: MachineAlarm.name, schema: MachineAlarmSchema }]),
    MachinesModule,
  ],
  controllers: [MachineAlarmController],
  providers: [MachineAlarmService],
  exports: [MachineAlarmService],
})
export class MachineAlarmModule { }