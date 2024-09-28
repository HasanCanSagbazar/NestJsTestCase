import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/order/schema/order.schema';
import { OrderService } from 'src/order/order.service';
import { UsersService } from 'src/auth/users/users.service';
import { OrderItemSchema } from 'src/order/schema/order-item.schema';
import { ProductService } from 'src/product/product.service';
import { UserSchema } from 'src/auth/users/schemas/user.schema';
import { ProductSchema } from 'src/product/schemas/product.schema';
import { CategoryService } from 'src/category/category.service';
import { CategorySchema } from 'src/category/schema/category.schema';
import { BlacklistTokenService } from 'src/auth/token/blacklisttoken.service';
import { BlacklistTokenModule } from 'src/auth/token/blacklisttoken.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Category', schema: CategorySchema},
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderItem', schema: OrderItemSchema },
    ]),
    BlacklistTokenModule,
    AuthModule,
  ],

  controllers: [PaymentController],
  providers: [PaymentService, OrderService, UsersService, ProductService, CategoryService]
})
export class PaymentModule {}
