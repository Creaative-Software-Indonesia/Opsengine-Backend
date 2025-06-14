import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCompanySignatureDto {
  @ApiProperty({
    description: 'Company GUID (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  companyGuid?: string;

  @ApiProperty({
    description: 'Auto-generated GUID (optional)',
    example: 'DATA-45671234-5678-2023',
    required: false,
    readOnly: true, // Menandakan field ini tidak boleh diisi manual
  })
  @IsOptional()
  @IsString()
  guid?: string;

  @ApiProperty({
    description: 'Full name of the company (required)',
    example: 'PT. Contoh Perusahaan',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({
    description: 'URL of company logo (required)',
    example: 'https://example.com/logo.png',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  companyLogo: string;
}

export class AddEmployeeSignatureDto {
  @ApiProperty({
    description: 'User GUID (UUID format)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  userGuid: string;

  @ApiProperty({
    description: 'Employee full name',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional({
    description: 'URL or base64 encoded signature image',
    example: 'https://example.com/signatures/john-doe.png',
  })
  @IsOptional()
  @IsString()
  signatureImage?: string;

  @ApiPropertyOptional({
    description: 'Employee position/job title',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Whether the signature is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCompanySignatureDto {
  @ApiPropertyOptional({
    description: 'New company name',
    example: 'PT. Contoh Perusahaan Baru',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'New company logo URL',
    example: 'https://example.com/new-logo.png',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  companyLogo?: string;

  @ApiPropertyOptional({
    description: 'Status aktif perusahaan',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
