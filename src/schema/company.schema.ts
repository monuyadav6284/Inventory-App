import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Company {
  @Prop({ unique: true })
  company: string;

  @Prop()
  products: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: User;

  @Prop()
  date: Date;
}

export const companySchema = SchemaFactory.createForClass(Company);
