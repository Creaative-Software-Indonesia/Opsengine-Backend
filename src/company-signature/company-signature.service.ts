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

  async addEmployeeSignature(
    companyGuid: string,
    employeeDto: AddEmployeeSignatureDto,
  ) {
    try {
      const company = await this.companySignatureModel.findOne({ companyGuid });
      if (!company) {
        return ResponseUtil.notFound('Company not found');
      }

      // Check if employee already exists
      const employeeExists = company.employees.some(
        (emp) => emp.userGuid === employeeDto.userGuid,
      );

      if (employeeExists) {
        return ResponseUtil.error('Employee signature already exists');
      }

      const updated = await this.companySignatureModel.findOneAndUpdate(
        { companyGuid },
        {
          $push: {
            employees: {
              ...employeeDto,
              isActive: employeeDto.isActive ?? true,
            },
          },
        },
        { new: true },
      );

      return ResponseUtil.success(
        updated,
        'Employee signature added successfully',
      );
    } catch (error) {
      return ResponseUtil.error(error.message);
    }
  }

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
}
