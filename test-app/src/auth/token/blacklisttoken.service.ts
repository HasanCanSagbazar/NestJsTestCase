import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlacklistToken } from './schema/blacklisttoken.schema';
import { CreateBlacklistTokenDto } from './dto/create-blacklisttoken.dto';


@Injectable()
export class BlacklistTokenService {
  constructor(
    @InjectModel(BlacklistToken.name) 
    private blacklistTokenModel: Model<BlacklistToken>,
  ) {}

  @Cron('*/15 * * * *')
  async removeExpiredTokens() {
    const now = new Date();
    await this.blacklistTokenModel.deleteMany({ expiryDate: { $lt: now } });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const foundToken = await this.blacklistTokenModel.findOne({ token });
    return !!foundToken;
  }

  async addToken(createBlacklistTokenDto: CreateBlacklistTokenDto): Promise<void> {
    await new this.blacklistTokenModel(createBlacklistTokenDto).save();
  }
}
