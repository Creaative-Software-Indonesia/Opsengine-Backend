import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlarmHandling, AlarmHandlingSchema } from './schemas/alarm-handling.schema/alarm-handling.schema';
import { MachineAlarmModule } from 'src/machine-alarms/machine-alarms.module';
import { AlarmHandlingController } from './alarm-handlings.controller';
import { AlarmHandlingService } from './alarm-handlings.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: AlarmHandling.name, schema: AlarmHandlingSchema }]),
    MachineAlarmModule,
  ],
  controllers: [AlarmHandlingController],
  providers: [AlarmHandlingService],
  exports: [AlarmHandlingService],
})
export class AlarmHandlingModule { }