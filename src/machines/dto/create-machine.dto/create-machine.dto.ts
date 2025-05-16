import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMachineDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  companyGuid?: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  userGuid?: string;

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