import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CardDetailsDto {
    @IsNotEmpty()
    @IsString()
    number: string;

    @IsNotEmpty()
    @IsNumber()
    exp_month: number;

    @IsNotEmpty()
    @IsNumber()
    exp_year: number;

    @IsNotEmpty()
    @IsString()
    cvc: string;
}