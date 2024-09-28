import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/users/schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { BlacklistTokenSchema } from '../token/schema/blacklisttoken.schema';
import { BlacklistTokenModule } from '../token/blacklisttoken.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'BlacklistToken', schema: BlacklistTokenSchema}]),
    BlacklistTokenModule,
    PassportModule
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
