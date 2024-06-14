import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Product {
  @Prop()
  productsname: string;

  @Prop()
  description: string;

  @Prop()
  quantity: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: User;
}

export const productSchema = SchemaFactory.createForClass(Product);
