import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { OrderService } from 'src/order/order.service';
import { UsersService } from 'src/auth/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/order/schema/order.schema';
import { OrderItemSchema } from 'src/order/schema/order-item.schema';
import { ProductService } from 'src/product/product.service';
import { UserSchema } from 'src/auth/users/schemas/user.schema';
import { ProductSchema } from 'src/product/schemas/product.schema';
import { CategoryService } from 'src/category/category.service';
import { CategorySchema } from 'src/category/schema/category.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Category', schema: CategorySchema},
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderItem', schema: OrderItemSchema },
    ]),
  ],
  providers: [InvoiceService, OrderService, UsersService, ProductService, CategoryService],
  controllers: [InvoiceController]
})
export class InvoiceModule {}
