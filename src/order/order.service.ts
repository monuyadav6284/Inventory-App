import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderlistDto } from '../DTO/create-orderlist.dto';
import { populateOption } from '../product/product.service';
import { Orderlist } from '../schema/order.schema';
import { Product } from '../schema/product.schema';
import { User } from '../schema/user.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orderlist.name) private orderListModel: Model<Orderlist>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(
    user: any,
    createorderlistDto: CreateOrderlistDto,
  ): Promise<Orderlist[]> {
    try {
      const date = new Date(createorderlistDto.date);
      const userId = await this.userModel.findOne({ email: user.email });
      const createdOrderlist = new this.orderListModel({
        ...createorderlistDto,
        createdBy: userId._id,
      });
      createdOrderlist.orderdetail.map(async (order) => {
        await this.productModel.updateOne(
          { productsname: order.productname },
          { $inc: { quantity: -order.quantity } },
        );
      });
      if (!createdOrderlist) {
        throw new HttpException(' products Not created', HttpStatus.NOT_FOUND);
      }
      await createdOrderlist.save();
      return await this.orderListModel
        .find({ createdBy: user.id })
        .populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error creating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAlldata(): Promise<Orderlist[]>{
    return await this.orderListModel.find().exec();
  }

  async   addInvoice(image: Express.Multer.File, id: string) {
    await this.orderListModel.findById(id).updateOne({ invoice: image.buffer });
    return 'Invoice added successfully';
  }

  async findAll(user: any): Promise<Orderlist[]> {
    try {
      return await this.orderListModel
        .find({ createdBy: user.id })
        .populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error getting products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Orderlist> {
    try {
      return await this.orderListModel.findById(id).populate(populateOption);
    } catch (error) {
      throw new HttpException(
        'Error getting products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
