import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/auth/users/users.service';
import { UsersController } from 'src/auth/users/users.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenStrategy } from './strategy/refreshtoken.strategy';
import { BlacklistTokenSchema } from './token/schema/blacklisttoken.schema';
import { BlacklistTokenService } from './token/blacklisttoken.service';
import { JwtAuthGuard } from './guards/jwt.guard';


@Module({
  imports: [
    
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'BlacklistToken', schema: BlacklistTokenSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string | number>('JWT_EXPIRE') },
      }),
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    UsersService,
    BlacklistTokenService,
    JwtStrategy,
    RefreshTokenStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
