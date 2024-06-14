import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PRODUCT_SERVICE } from '../token';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from '../schema/product.schema';
import { User, userSchema } from '../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: User.name, schema: userSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_SERVICE,
      useClass: ProductService,
    },
  ],
})
export class ProductModule {}
