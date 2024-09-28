import { IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}