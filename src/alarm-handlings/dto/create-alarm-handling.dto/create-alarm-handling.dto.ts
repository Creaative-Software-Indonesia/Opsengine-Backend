import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlarmHandlingDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    machineGuid: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    alarmGuid: string;

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

export class UpdateAlarmHandlingDto {
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

export class AlarmHandlingResponseDto {
    @ApiProperty()
    machineGuid: string;

    @ApiProperty()
    alarmGuid: string;

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