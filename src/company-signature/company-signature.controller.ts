import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Query,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CompanySignatureService } from './company-signature.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import {
  AddEmployeeSignatureDto,
  CreateCompanySignatureDto,
  UpdateCompanySignatureDto,
} from './dto/create-company-signature.dto/create-company-signature.dto';
import { AuthenticatedRequest } from 'express';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Company Signatures')
@ApiBearerAuth()
@Controller('company-signatures')
@UseGuards(JwtAuthGuard)
export class CompanySignatureController {
  constructor(
    private readonly companySignatureService: CompanySignatureService,
  ) {}
  /**
   * Create a new company signature
   * @param createDto - Data for creating a company signature
   * @param req - Authenticated request containing user information
   * @returns Created company signature
   */
  @Post('create')
  @ApiOperation({ summary: 'Create company signature' })
  @ApiBody({ type: CreateCompanySignatureDto })
  @ApiResponse({ status: 201, description: 'Company signature created' })
  async create(
    @Body() createDto: CreateCompanySignatureDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user: any = req.user;
    const payload = {
      ...createDto,
      guid: `signature-${uuidv4()}-${new Date().getFullYear()}`,
      userGuid: user.guid,
      companyGuid: user.companyGuid,
    };
    return this.companySignatureService.create(payload);
  }
  /**
   * Add an employee signature
   * @param employeeDto - Data for adding an employee signature
   *
   * @param req - Authenticated request containing user information
   * @returns Added employee signature
   **/
  @Post('employees')
  @ApiOperation({ summary: 'Add employee signature' })
  @ApiBody({ type: AddEmployeeSignatureDto })
  @ApiResponse({ status: 201, description: 'Employee signature added' })
  async addEmployeeSignature(
    @Body() employeeDto: AddEmployeeSignatureDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user: any = req.user;
    const companyGuid = user.companyGuid;

    const payload = {
      ...employeeDto
    };
    return this.companySignatureService.addEmployeeSignature(
      companyGuid,
      payload,
    );
  }

  /**
   * 
   * @param req - Authenticated request containing user information
   * Retrieves the company signature for the authenticated user's company.
   * @returns 
   */
  @Get('get')
  @ApiOperation({ summary: 'Get company signature' })
  @ApiResponse({ status: 200, description: 'Company signature retrieved' })
  async getCompanySignature(@Req() req: AuthenticatedRequest) {
    const user: any = req.user;
    const companyGuid = user.companyGuid;
    return this.companySignatureService.getCompanySignature(companyGuid);
  }

  @Get('/get/employees')
  @ApiOperation({ summary: 'Get employee signatures' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Employee signatures retrieved' })
  async getEmployeeSignatures(
     @Req() req: AuthenticatedRequest,
    @Query('isActive') isActive: boolean = true,
  ) {
    const user: any = req.user;
    const companyGuid = user.companyGuid;
    return this.companySignatureService.getEmployeeSignatures(
      companyGuid,
      isActive,
    );
  }

  @Put('update')
  @ApiOperation({ summary: 'Update company signature' })
  @ApiBody({ type: UpdateCompanySignatureDto })
  @ApiResponse({ status: 200, description: 'Company signature updated' })
  async updateCompanySignature(
    @Req() req: AuthenticatedRequest,
    @Body() updateDto: UpdateCompanySignatureDto,
  ) {
    const user: any = req.user;
    const companyGuid = user.companyGuid;
    return this.companySignatureService.updateCompanySignature(
      companyGuid,
      updateDto,
    );
  }

  @Put('update/employees/:userGuid')
  @ApiOperation({ summary: 'Update employee signature' })
  @ApiBody({ type: AddEmployeeSignatureDto })
  @ApiResponse({ status: 200, description: 'Employee signature updated' })
  async updateEmployeeSignature(
    @Req() req: AuthenticatedRequest,
    @Param('userGuid') userGuid: string,
    @Body() updateData: Partial<AddEmployeeSignatureDto>,
  ) {
    const user: any = req.user;
    const companyGuid = user.companyGuid;
    return this.companySignatureService.updateEmployeeSignature(
      companyGuid,
      userGuid,
      updateData,
    );
  }

  /**
   *  Deletes a company signature by its GUID.
   * @param guid - The GUID of the company signature to delete
   * @returns   
   */
  @Delete('/company/delete/:guid')
  @ApiOperation({ summary: 'Delete company signature' })
  @ApiParam({ name: 'guid', description: 'GUID' })
  @ApiResponse({ status: 200, description: 'Company signature deleted' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async deleteCompany(@Param('guid') guid: string) {
    return this.companySignatureService.deleteCompanySignature(guid);
  }

  /**
   * Deletes an employee signature by user GUID
   * @param companyGuid - The GUID of the company
   * @param userGuid - The GUID of the employee
   * *` @returns
   * */     
  @Delete('delete/employees/:userGuid')
  @ApiOperation({ summary: 'Delete employee signature' })
  @ApiParam({ name: 'userGuid', description: 'Employee User GUID' })
  @ApiResponse({ status: 200, description: 'Employee signature deleted' })
  @ApiResponse({ status: 404, description: 'Company or employee not found' })
  async deleteEmployee(
    @Req() req: AuthenticatedRequest,
    @Param('userGuid') userGuid: string,
  ) {
     const user: any = req.user;
    const companyGuid = user.companyGuid;
    return this.companySignatureService.deleteEmployeeSignature(companyGuid, userGuid);
  }
}
