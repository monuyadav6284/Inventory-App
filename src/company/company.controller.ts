import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { COMPANY_SERVICE } from '../token';
import { CompanyService } from './company.service';
import { Request } from 'express';
import { CompanyDto, UpdateCompanyDto } from '../DTO/company.dto';

@Controller('company')
export class CompanyController {
  constructor(
    @Inject(COMPANY_SERVICE) private companyService: CompanyService,
  ) { }




  @Post('create')
  create(@Req() req: Request, @Body() company: CompanyDto) {
    return this.companyService.create(req.user, company);
  }



  @Get('getall')
  getAll(@Req() req: Request) {
    return this.companyService.getAll(req.user);
  }
  @Put('update/:id')
  async updateCompany(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() newCompany: UpdateCompanyDto,
  ) {
    try {
      return await this.companyService.updateCompany(req.user, id, newCompany);
    } catch (error) {
      console.error('Update failed:', error);
      throw new HttpException(
        'Unable to update record',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('deletecompany/:id')
  deleteOne(@Req() req: Request, @Param('id') id: string) {

    return this.companyService.deleteOne(req.user, id);
  }
}
