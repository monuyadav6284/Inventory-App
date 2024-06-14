import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { COMPANY_SERVICE } from '../token';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, companySchema } from '../schema/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: companySchema }]),
  ],
  controllers: [CompanyController],
  providers: [
    {
      provide: COMPANY_SERVICE,
      useClass: CompanyService,
    },
  ],
})
export class CompanyModule {}
