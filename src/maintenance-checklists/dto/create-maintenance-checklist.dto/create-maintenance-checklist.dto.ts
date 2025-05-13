import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMaintenanceChecklistDto {
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

export class UpdateMaintenanceChecklistDto {
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

export class MaintenanceChecklistResponseDto {
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