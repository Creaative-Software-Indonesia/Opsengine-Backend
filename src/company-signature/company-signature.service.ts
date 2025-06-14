import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanySignature } from './entities/company.entity';

import { ResponseUtil } from 'src/common/response.util';
import {
  AddEmployeeSignatureDto,
  CreateCompanySignatureDto,
  UpdateCompanySignatureDto,
} from './dto/create-company-signature.dto/create-company-signature.dto';

@Injectable()
export class CompanySignatureService {
  constructor(
    @InjectModel(CompanySignature.name)
    private companySignatureModel: Model<CompanySignature>,
  ) {}
  /**
   *
   * @param createDto - Data for creating a company signature
   * @returns
   */
  async create(createDto: CreateCompanySignatureDto) {
    try {
      const existing = await this.companySignatureModel.findOne({
        companyGuid: createDto.companyGuid,
      });

      if (existing) {
        return ResponseUtil.error('Company signature already exists');
      }

      const created = new this.companySignatureModel(createDto);
      const result = await created.save();
      return ResponseUtil.success(
        result,
        'Company signature created successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  /**
   *
   * @param companyGuid
   * @param employeeDto
   * @returns
   */

  async addEmployeeSignature(
    companyGuid: string,
    employeeDto: AddEmployeeSignatureDto,
  ) {
    try {
      // 1. Find the company
      const company = await this.companySignatureModel.findOne({ companyGuid });

      if (!company) {
        return ResponseUtil.notFound('Company not found');
      }
      console.log(employeeDto.userGuid);
      // 2. Check for existing employee
      const employeeExists =
        company.employees?.some(
          (emp) => emp.userGuid === employeeDto.userGuid,
        ) ?? false;

      console.log('Employee exists:', employeeExists);
      if (employeeExists) {
        return ResponseUtil.error('Employee signature already exists');
      }

      // 3. Prepare the new employee data
      const newEmployee = {
        userGuid: employeeDto.userGuid,
        fullName: employeeDto.fullName,
        signatureImage: employeeDto.signatureImage,
        position: employeeDto.position,
        isActive: employeeDto.isActive ?? true, // Default to true if not provided
      };

      // 4. Update the company
      const updated = await this.companySignatureModel.findOneAndUpdate(
        { companyGuid },
        {
          $push: {
            employees: newEmployee, // Push the properly structured employee object
          },
        },
        { new: true }, // Return the updated document
      );

      return ResponseUtil.success(
        updated,
        'Employee signature added successfully',
      );
    } catch (error) {
      console.error('Error adding employee signature:', error);
      return ResponseUtil.error(error.message);
    }
  }

  /**
   * Update company signature
   * @param companyGuid - Unique identifier for the company
   * @param updateDto - Data for updating the company signature
   * @returns Updated company signature or error message
   */
  async updateCompanySignature(
    companyGuid: string,
    updateDto: UpdateCompanySignatureDto,
  ) {
    try {
      const updated = await this.companySignatureModel.findOneAndUpdate(
        { companyGuid },
        updateDto,
        { new: true },
      );

      if (!updated) {
        return ResponseUtil.notFound('Company not found');
      }

      return ResponseUtil.success(
        updated,
        'Company signature updated successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async getCompanySignature(companyGuid: string) {
    try {
      const company = await this.companySignatureModel.findOne({ companyGuid });
      if (!company) {
        return ResponseUtil.notFound('Company not found');
      }
      return ResponseUtil.success(
        company,
        'Company signature retrieved successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async getEmployeeSignatures(companyGuid: string, isActive = true) {
    try {
      const company = await this.companySignatureModel.findOne(
        { companyGuid },
        { employees: { $elemMatch: { isActive } } },
      );

      if (!company) {
        return ResponseUtil.notFound('Company not found');
      }

      return ResponseUtil.success(
        company.employees,
        'Employee signatures retrieved successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async updateEmployeeSignature(
    companyGuid: string,
    userGuid: string,
    updateData: Partial<AddEmployeeSignatureDto>,
  ) {
    try {
      const updateObj = {};
      for (const key in updateData) {
        updateObj[`employees.$.${key}`] = updateData[key];
      }

      const updated = await this.companySignatureModel.findOneAndUpdate(
        { companyGuid, 'employees.userGuid': userGuid },
        { $set: updateObj },
        { new: true },
      );

      if (!updated) {
        return ResponseUtil.notFound('Employee signature not found');
      }

      return ResponseUtil.success(
        updated,
        'Employee signature updated successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async deleteCompanySignature(guid: string) {
    try {
      // Soft delete approach (recommended)
      // const deletedCompany = await this.companySignatureModel.findOneAndUpdate(
      //   { guid },
      //   { $set: { isActive: false } },
      //   { new: true },
      // );

      // Alternative hard delete:
      const deletedCompany = await this.companySignatureModel.findOneAndDelete({ guid });

      if (!deletedCompany) {
        return ResponseUtil.notFound('Company not found');
      }

      return ResponseUtil.success(
        deletedCompany,
        'Company signature deactivated successfully',
        // 'Company signature deleted permanently' // for hard delete
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

  async deleteEmployeeSignature(companyGuid: string, userGuid: string) {
    try {
      // Option 1: Remove from array
      const updatedCompany = await this.companySignatureModel.findOneAndUpdate(
        { companyGuid, 'employees.userGuid': userGuid },
        { $pull: { employees: { userGuid } } },
        { new: true },
      );

      // Option 2: Soft delete (set isActive: false)
      /*
    const updatedCompany = await this.companySignatureModel.findOneAndUpdate(
      { companyGuid, 'employees.userGuid': userGuid },
      { $set: { 'employees.$.isActive': false } },
      { new: true }
    );
    */

      if (!updatedCompany) {
        return ResponseUtil.notFound('Company or employee not found');
      }

      return ResponseUtil.success(
        updatedCompany,
        'Employee signature removed successfully',
        // 'Employee signature deactivated successfully' // for soft delete
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }
}
