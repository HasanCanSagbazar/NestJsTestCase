import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './auth/users/users.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UserSchema } from './auth/users/schemas/user.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { BlacklistTokenSchema } from './auth/token/schema/blacklisttoken.schema';
import { OrderModule } from './order/order.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PaymentModule } from './payment/payment.module';
import { json } from 'body-parser';
import { InvoiceModule } from './invoice/invoice.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'BlacklistToken', schema: BlacklistTokenSchema}]),
    AuthModule,
    UsersModule,
    ProductModule,
    CategoryModule,

    ScheduleModule.forRoot(),

    OrderModule,

    PaymentModule,

    InvoiceModule,

    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(json({ verify: (req: any, res, buf) => { req.rawBody = buf } })).forRoutes('payments/webhook');
  }
 
}
