import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMachineAlarmDto {
  // Diambil dari token, tidak perlu diinput dari frontend
  // Tidak perlu validasi maupun dokumentasi Swagger
  companyGuid?: string;

  // Diambil dari token, tidak perlu diinput dari frontend
  userGuid?: string;

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
