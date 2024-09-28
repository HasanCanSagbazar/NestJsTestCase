import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Role } from "src/auth/enums/role.enum";

@Schema({ timestamps: true })
export class User extends Document{
    @Prop({required: true})
    firstName: string

    @Prop({required: true})
    lastName: string
    
    @Prop({unique: true, required: true })
    userName: string
    
    @Prop({required:true, unique: true})
    email: string

    @Prop({ unique: true, required: true })
    mobileNo : string

    @Prop({required: true})
    password: string

    @Prop({ default: false })
    isPremium: boolean;

    @Prop({
        type: [{type: String, enum:Role}],
        default: [Role.User]
    })
    role: Role[]

    @Prop()
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);