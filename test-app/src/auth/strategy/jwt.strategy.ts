import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"

import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/auth/users/schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
    ){
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET,
                ignoreExpiration: false,
            }
        );
    }

    async validate(payload): Promise<any> {
        const {id} = payload;
        const user = await this.userModel.findById(id);
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
    }


}