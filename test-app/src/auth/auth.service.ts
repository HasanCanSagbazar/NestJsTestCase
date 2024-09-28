import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from 'src/auth/users/users.service';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { BlacklistToken } from './token/schema/blacklisttoken.schema';
import { BlacklistTokenService } from './token/blacklisttoken.service';


@Injectable()
export class AuthService {
    private readonly saltRounds = 10
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private usersService: UsersService,
        private jwtService: JwtService,
        private blacklisttokenService: BlacklistTokenService
        
    ){}

    async validateUser(identifier: string, password: string): Promise<User | undefined>{
        let user: User | undefined;

        if (this.isEmail(identifier)) {
            user = await this.usersService.findOneByEmail(identifier);
        } else if (this.isPhoneNumber(identifier)) {
            user = await this.usersService.findOneByMobileNo(identifier);
        } else {
            user = await this.usersService.findOneByUsername(identifier);
        }
    
        
        if (!user) {
            throw new BadRequestException('User not found!');
        }
    
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
    
        return user;
    }


    async signIn(signInDto: SignInDto){
        const { identifier, password } = signInDto;

        let user, info;
        if (this.isEmail(identifier)) {
            user = await this.usersService.findOneByEmail(identifier);
            info = 'email';
        } else if (this.isPhoneNumber(identifier)) {
            user = await this.usersService.findOneByMobileNo(identifier);
            info = 'phone number';
        } else {
            user = await this.usersService.findOneByUsername(identifier);
            info = 'username';
        }

        if (!user) {
            throw new Error(`User not found! Invalid ${info}`);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error(`Invalid password!`);
        }

        const tokens = this.getTokens(user.id);
        await this.updateRefreshToken(user.id, (await tokens).refreshToken)
        return tokens;
    }

    async signUp(user: SignUpDto){
        const existingUserByUsername = await this.usersService.findOneByUsername(user.userName);
        const existingUserByEmail = await this.usersService.findOneByEmail(user.email);
        if(existingUserByUsername){
            throw new BadRequestException('Email already exists!');
        }
        if(existingUserByEmail){
            throw new BadRequestException("Username already exists!");
        }
        const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);

        const newUser = new this.userModel({...user, password: hashedPassword});
        await this.usersService.create(newUser);

        //const token = this.jwtService.sign({id: newUser._id});

        const tokens = this.getTokens(newUser.id);
        await this.updateRefreshToken(newUser.id, (await tokens).refreshToken)

        return tokens;
    }

    async logout(userId: string, token: string) {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 15); 
        await this.blacklisttokenService.addToken({ token, expiryDate });

        return this.usersService.updateUser(userId, { refreshToken: null });
      }

    async getTokens(userId: string){
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
              {
                id: userId,
              },
              {
                
                expiresIn: '15m',
              },
            ),
            this.jwtService.signAsync(
              {
                id: userId,
              },
              {
                expiresIn: '7d',
              },
            ),
          ]);
      
          return {
            accessToken,
            refreshToken,
          };
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, this.saltRounds);
        await this.usersService.updateUser(userId, {
          refreshToken: hashedRefreshToken,
        });
    }

    private isEmail(identifier: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(identifier);
    }

    private isPhoneNumber(identifier: string): boolean {
        const phoneRegex = /^[0-9]{10,15}$/; 
        return phoneRegex.test(identifier);
    }
}
