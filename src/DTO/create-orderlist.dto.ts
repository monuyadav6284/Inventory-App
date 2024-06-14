import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderDetail {
  @IsString()
  productname: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderlistDto {
  @IsString()
  @IsNotEmpty()
  companyname: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => OrderDetail)
  orderdetail: OrderDetail[];

  @IsString()
  @IsNotEmpty()
  date: string;
}
