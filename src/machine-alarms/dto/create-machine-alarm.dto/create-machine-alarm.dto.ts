import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMachineAlarmDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    machineGuid: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateMachineAlarmDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
}

export class MachineAlarmResponseDto {
    @ApiProperty()
    machineGuid: string;

    @ApiProperty()
    guid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}