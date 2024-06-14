import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CompanyDto {
  @IsString()
  @IsNotEmpty()

  company: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  products: string[];

  @IsString()
  @IsNotEmpty()
  date?: string
}

export class UpdateCompanyDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  products: string[];
}