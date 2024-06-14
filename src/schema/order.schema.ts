import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Blob } from 'buffer';
import mongoose from 'mongoose';
import { UserDto } from '../DTO/user.dto';

export type OrderDetail = {
  productname: string;
  quantity: number;
};

@Schema()
export class Orderlist {
  @Prop()
  companyname: string;

  @Prop([])
  orderdetail: OrderDetail[];

  @Prop()
  date: Date;

  @Prop()
  invoice?: Blob;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: UserDto;
}

export const orderlistSchema = SchemaFactory.createForClass(Orderlist);
