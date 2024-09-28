import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schema/category.schema';
import { AuthModule } from 'src/auth/auth.module';
import { BlacklistTokenService } from 'src/auth/token/blacklisttoken.service';
import { BlacklistTokenModule } from 'src/auth/token/blacklisttoken.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    BlacklistTokenModule,
    MongooseModule.forFeature([{name: 'Category', schema: CategorySchema}]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}
