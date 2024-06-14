import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../DTO/create-product.dto';
import { UpdateProductDto } from '../DTO/update-product.dto';
import { Request } from 'express';
import { User } from 'src/utils/public.decorator';
import { PRODUCT_SERVICE } from 'src/token';
import { accessPayload } from 'src/utils/type';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productService: ProductService,
  ) {}

  @Post('create')
  create(
    @User() user: accessPayload,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(user, createProductDto);
  }

  @Get('findall')
  getAll(@User() user: accessPayload) {
    return this.productService.getAll(user);
  }

  @Put('updateproducts/:id')
  updateProduct(
    @User() user: accessPayload,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(user, id, updateProductDto);
  }

  @Delete('deleteone/:id')
  deleteone(@User() user: accessPayload, @Param('id') id: string) {
    return this.productService.deleteone(user, id);
  }
}
