import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateMachineDto } from '../create-machine.dto/create-machine.dto';


export class UpdateMachineDto extends PartialType(CreateMachineDto) {}