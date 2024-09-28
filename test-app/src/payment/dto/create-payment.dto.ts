import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethodDto } from './payment-method.dto'; 

export class CreatePaymentDto {

    @IsNotEmpty()
    @ValidateNested() 
    @Type(() => PaymentMethodDto)
    payment_method_data: PaymentMethodDto;
}
