import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/signUp.dto';
import { User } from 'src/auth/users/schemas/user.schema';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ){}

    async create(signUpDto: SignUpDto): Promise<User> {
        const newUser = new this.userModel(signUpDto);
        return newUser.save();
    }

    async findAll(): Promise<User[]>{
        return this.userModel.find().exec();
    }

    async findById(_id: string): Promise<User | undefined> {
        return this.userModel.findById(_id).exec();
    }

    async findOneByUsername(userName: string): Promise<User | undefined>{
        return this.userModel.findOne({userName}).exec();
    }

    async findOneByEmail(email: string): Promise<User | undefined>{
        return this.userModel.findOne({email}).exec();
    }
    
    async findOneByMobileNo(mobileNo: string): Promise<User | undefined>{
        return this.userModel.findOne({mobileNo}).exec();
    }

    async findPremiumUsers(): Promise<User[]>{
        return this.userModel.find({isPremium: true}).exec();
    }

    async updateUser(_id: string, updateUserDto: UpdateUserDto): Promise<User>{
        return this.userModel.findByIdAndUpdate(_id, updateUserDto, {new: true}).exec();
    }

    async deleteUser(_id: string): Promise<any>{
        return this.userModel.findByIdAndDelete(_id).exec();
    }

}
