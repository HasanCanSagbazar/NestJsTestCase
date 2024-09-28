import { IsString, IsArray, IsNotEmpty, IsNumber, ArrayNotEmpty, IsOptional } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
    @IsOptional()
    @IsNumber()
    userId?: string; 
  
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    items: OrderItemDto[];
}
