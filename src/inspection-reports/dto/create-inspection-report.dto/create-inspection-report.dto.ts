import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// Item Level DTOs
class ChecklistItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  checklistGuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  checklistName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

// Request DTOs
export class CreateInspectionReportDto {
  guid?: string;
  companyGuid?: string;
  userGuid?: string;
  employeeGuid?: string;
  employeeName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  machineGuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  machineName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  machineCode: string;

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

// Response DTOs
export class InspectionReportResponseDto {
  guid?: string;
  companyGuid?: string;
  userGuid?: string;
  employeeGuid?: string;
  employeeName?: string;

  @ApiProperty()
  machineGuid: string;

  @ApiProperty()
  machineName: string;

  @ApiProperty()
  machineCode: string;

  @ApiProperty({ type: [ChecklistItemDto] })
  checklists: ChecklistItemDto[];

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// Pagination DTOs
class PaginationMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginatedInspectionReportResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [InspectionReportResponseDto] })
  data: InspectionReportResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
