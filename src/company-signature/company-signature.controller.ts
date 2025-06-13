import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CompanySignatureService } from './company-signature.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
// import { ResponseUtil } from '../common/response.util';
import {
  AddEmployeeSignatureDto,
  CreateCompanySignatureDto,
  UpdateCompanySignatureDto,
} from './dto/create-company-signature.dto/create-company-signature.dto';

@ApiTags('Company Signatures')
@ApiBearerAuth()
@Controller('company-signatures')
@UseGuards(JwtAuthGuard)
export class CompanySignatureController {
  constructor(
    private readonly companySignatureService: CompanySignatureService,
    // private readonly responseUtil: ResponseUtil,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create company signature' })
  @ApiBody({ type: CreateCompanySignatureDto })
  @ApiResponse({ status: 201, description: 'Company signature created' })
  async create(@Body() createDto: CreateCompanySignatureDto) {
    return this.companySignatureService.create(createDto);
  }

  @Post(':companyGuid/employees')
  @ApiOperation({ summary: 'Add employee signature' })
  @ApiBody({ type: AddEmployeeSignatureDto })
  @ApiResponse({ status: 201, description: 'Employee signature added' })
  async addEmployeeSignature(
    @Param('companyGuid') companyGuid: string,
    @Body() employeeDto: AddEmployeeSignatureDto,
  ) {
    return this.companySignatureService.addEmployeeSignature(
      companyGuid,
      employeeDto,
    );
  }

  @Get(':companyGuid')
  @ApiOperation({ summary: 'Get company signature' })
  @ApiResponse({ status: 200, description: 'Company signature retrieved' })
  async getCompanySignature(@Param('companyGuid') companyGuid: string) {
    return this.companySignatureService.getCompanySignature(companyGuid);
  }

  @Get(':companyGuid/employees')
  @ApiOperation({ summary: 'Get employee signatures' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Employee signatures retrieved' })
  async getEmployeeSignatures(
    @Param('companyGuid') companyGuid: string,
    @Query('isActive') isActive: boolean = true,
  ) {
    return this.companySignatureService.getEmployeeSignatures(
      companyGuid,
      isActive,
    );
  }

  @Put(':companyGuid')
  @ApiOperation({ summary: 'Update company signature' })
  @ApiBody({ type: UpdateCompanySignatureDto })
  @ApiResponse({ status: 200, description: 'Company signature updated' })
  async updateCompanySignature(
    @Param('companyGuid') companyGuid: string,
    @Body() updateDto: UpdateCompanySignatureDto,
  ) {
    return this.companySignatureService.updateCompanySignature(
      companyGuid,
      updateDto,
    );
  }

  @Put(':companyGuid/employees/:userGuid')
  @ApiOperation({ summary: 'Update employee signature' })
  @ApiBody({ type: AddEmployeeSignatureDto })
  @ApiResponse({ status: 200, description: 'Employee signature updated' })
  async updateEmployeeSignature(
    @Param('companyGuid') companyGuid: string,
    @Param('userGuid') userGuid: string,
    @Body() updateData: Partial<AddEmployeeSignatureDto>,
  ) {
    return this.companySignatureService.updateEmployeeSignature(
      companyGuid,
      userGuid,
      updateData,
    );
  }
}
