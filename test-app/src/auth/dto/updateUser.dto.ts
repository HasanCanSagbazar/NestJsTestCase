import { IsString, IsEmail, IsPhoneNumber, Length, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    userName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsPhoneNumber(null)
    @IsOptional()
    mobileNo?: string;

    @IsString()
    @IsOptional()
    @Length(8)
    password?: string;

    @IsBoolean()
    @IsOptional()
    isPremium?: boolean;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}