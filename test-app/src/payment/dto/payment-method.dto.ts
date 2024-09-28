import { IsNotEmpty, IsObject, IsString, } from 'class-validator';
import { CardDetailsDto } from './card-details.dto';

export class PaymentMethodDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsObject()
    card: CardDetailsDto;
}