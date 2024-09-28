import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  readonly userId?: string;

  @IsArray()
  @IsOptional()
  readonly productIds?: string[]; 

  @IsNumber()
  @IsOptional()
  readonly totalAmount?: number;
}
