import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlacklistToken, BlacklistTokenSchema } from './schema/blacklisttoken.schema';
import { BlacklistTokenService } from './blacklisttoken.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: BlacklistToken.name, schema: BlacklistTokenSchema }]),
  ],
  providers: [BlacklistTokenService],
  exports: [BlacklistTokenService],
})
export class BlacklistTokenModule {}
