import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCompanySignatureDto {
  @IsNotEmpty()
  companyGuid: string;

  @IsOptional()
  companyLogo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AddEmployeeSignatureDto {
  @IsNotEmpty()
  userGuid: string;

  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  signatureImage?: string;

  @IsOptional()
  position?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCompanySignatureDto {
  @IsOptional()
  companyLogo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
