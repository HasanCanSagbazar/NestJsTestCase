import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsPhoneNumber(null)
    @IsNotEmpty()
    mobileNo: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}