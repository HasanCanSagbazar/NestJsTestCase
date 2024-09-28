import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './auth/users/schemas/user.schema';
import { Model } from 'mongoose';
import { Role } from './auth/enums/role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    @InjectModel(User.name)
    private userModel:Model<User>,
    private configService: ConfigService
  ){}  

  getHello():string{
    return "Hello";
  }

  async onModuleInit() {
    const adminExists = await this.userModel.findOne({role: Role.Admin});

    if(!adminExists){
      const adminUser = new this.userModel({
        firstName: this.configService.get('ADMIN_FIRST_NAME'),
        lastName: this.configService.get('ADMIN_LAST_NAME'),
        userName: this.configService.get('ADMIN_USERNAME'),
        email: this.configService.get('ADMIN_EMAIL'),
        mobileNo: this.configService.get('ADMIN_MOBILE_NO'),
        password: this.configService.get('ADMIN_PASSWORD_HASH'),
        isPremium: this.configService.get('ADMIN_IS_PREMIUM') === 'true',
        role: [Role.User, Role.Admin],
      });
      await adminUser.save();
    }
  }
}
