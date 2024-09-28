import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryService } from 'src/category/category.service';
import { CategoryController } from 'src/category/category.controller';
import { UsersService } from 'src/auth/users/users.service';
import { UserSchema } from 'src/auth/users/schemas/user.schema';
import { BlacklistTokenModule } from 'src/auth/token/blacklisttoken.module';
import { CategorySchema } from 'src/category/schema/category.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    BlacklistTokenModule,
    MongooseModule.forFeature([{name: 'Product', schema: ProductSchema}]),
    MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}]),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}])
  ],
  providers: [ProductService, CategoryService, UsersService],
  controllers: [ProductController, CategoryController]
})
export class ProductModule {}
