import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UsersService } from 'src/auth/users/users.service';
import { ProductService } from 'src/product/product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { OrderItemSchema } from './schema/order-item.schema';
import { UserSchema } from 'src/auth/users/schemas/user.schema';
import { ProductSchema } from 'src/product/schemas/product.schema';
import { CategoryService } from 'src/category/category.service';
import { CategorySchema } from 'src/category/schema/category.schema';
import { AuthModule } from 'src/auth/auth.module';
import { BlacklistTokenModule } from 'src/auth/token/blacklisttoken.module';
import { PassportModule } from '@nestjs/passport';

@Module({

  imports:[
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Category', schema: CategorySchema},
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderItem', schema: OrderItemSchema },
    ]),
    AuthModule,
    BlacklistTokenModule,
    
  ],
  providers: [OrderService, UsersService, ProductService, CategoryService],
  controllers: [OrderController]
})
export class OrderModule {}
