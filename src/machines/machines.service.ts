import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Machine } from './schemas/machine.schema/machine.schema';
import { CreateMachineDto } from './dto/create-machine.dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto/update-machine.dto';

@Injectable()
export class MachinesService {
    constructor(@InjectModel(Machine.name) private machineModel: Model<Machine>) { }

    async create(createMachineDto: CreateMachineDto): Promise<Machine> {
        const guid = `MACHINE-${uuidv4()}-${new Date().getFullYear()}`;
        const createdMachine = new this.machineModel({
            ...createMachineDto,
            guid,
        });
        return createdMachine.save();
    }

    async findAll(page: number, limit: number): Promise<{ data: Machine[]; total: number }> {
        const skip = (page - 1) * limit;
        const data = await this.machineModel.find().skip(skip).limit(limit).exec();
        const total = await this.machineModel.countDocuments().exec();
        return { data, total };
    }

       async findByCompany(page: number, limit: number,companyGuid:string): Promise<{ data: Machine[]; total: number }> {
        const skip = (page - 1) * limit;
        const data = await this.machineModel.find({companyGuid}).skip(skip).limit(limit).exec();
        const total = await this.machineModel.countDocuments({companyGuid}).exec();
        return { data, total };
    }

    async findOne(guid: string) {
        return this.machineModel.findOne({ guid }).exec();
    }

    async update(guid: string, updateMachineDto: UpdateMachineDto) {
        return this.machineModel.findOneAndUpdate({ guid }, updateMachineDto, { new: true }).exec();
    }

    async remove(guid: string) {
        return this.machineModel.findOneAndDelete({ guid }).exec();
    }
}