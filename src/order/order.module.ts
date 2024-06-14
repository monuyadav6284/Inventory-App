import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ORDER_SERVICE } from '../token';
import { MongooseModule } from '@nestjs/mongoose';
import { Orderlist, orderlistSchema } from '../schema/order.schema';
import { User, userSchema } from '../schema/user.schema';
import { Product, productSchema } from '../schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orderlist.name, schema: orderlistSchema },
      { name: User.name, schema: userSchema },
      { name: Product.name, schema: productSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_SERVICE,
      useClass: OrderService,
    },
  ],
})
export class OrderModule {}
