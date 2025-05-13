import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class ChecklistItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    checklistGuid: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class CreateInspectionReportDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    employeeGuid: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    employeeName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    machineGuid: string;

    @ApiProperty({ type: [ChecklistItemDto] })
    @IsArray()
    checklists: ChecklistItemDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDate()
    date?: Date;
}

export class UpdateInspectionReportDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    employeeName?: string;

    @ApiProperty({ type: [ChecklistItemDto], required: false })
    @IsOptional()
    @IsArray()
    checklists?: ChecklistItemDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDate()
    date?: Date;
}

export class InspectionReportResponseDto {
    @ApiProperty()
    employeeGuid: string;

    @ApiProperty()
    employeeName: string;

    @ApiProperty()
    machineGuid: string;

    @ApiProperty()
    checklists: {
        checklistGuid: string;
        status: boolean;
        notes: string;
    }[];

    @ApiProperty()
    date: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}