import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ORDER_SERVICE } from '../token';
import { OrderService } from './order.service';
import { CreateOrderlistDto } from '../DTO/create-orderlist.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('order')
export class OrderController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderService: OrderService,
  ) {}

  @Post('create')
  create(@Req() req: Request, @Body() createorderlistDto: CreateOrderlistDto) {
    return this.orderService.create(req.user, createorderlistDto);
  }

  @Get('allData')
  getAllData(){
     return this.orderService.getAlldata();
  }


  @Post('invoice/:id')
  @UseInterceptors(FileInterceptor('image'))
  addInvoice(
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.orderService.addInvoice(image, id);
  }

  @Get('getall')
  findAll(@Req() req: Request) {
    return this.orderService.findAll(req.user);
  }

  @Get('getone/:id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
