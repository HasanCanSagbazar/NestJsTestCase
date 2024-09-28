import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SignInDto {
    @IsString()
    @IsNotEmpty()
    identifier: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;
}