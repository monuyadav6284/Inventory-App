import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyDto, UpdateCompanyDto } from '../DTO/company.dto';
import { Company } from '../schema/company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async create(user: any, company: CompanyDto) {
    try {
      const createdBy = user.id;
      const newCompany = new this.companyModel({ ...company, createdBy });
      await newCompany.save();
      return await this.companyModel.find({ createdBy: user.id });
    } catch (error) {
      throw new HttpException(
        'Unable to create company record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAll(user: any): Promise<Company[]> {
    return await this.companyModel.find({ createdBy: user.id });
  }

  async updateCompany(
    user: any,
    id: string,
    newCompany: UpdateCompanyDto,
  ): Promise<Company[]> {
    try {
      await this.companyModel.updateOne(
        { _id: id, createdBy: user.id },
        { company: newCompany.company, products: newCompany.products },
      );
      return await this.companyModel.find({ createdBy: user.id });
    } catch (error) {
      throw new HttpException(
        'Unable to update record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOne(user: any, id: string): Promise<Company[]> {
    try {
      await this.companyModel.deleteOne({ _id: id });
      return await this.companyModel.find({ createdBy: user.id });
    } catch (error) {
      throw new HttpException(
        'Unable to delete record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
