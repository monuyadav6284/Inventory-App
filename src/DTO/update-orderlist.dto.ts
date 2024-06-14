import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderlistDto } from './create-orderlist.dto';

export class UpdateOrderlistDto extends PartialType(CreateOrderlistDto) {}
