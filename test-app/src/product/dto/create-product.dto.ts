import { IsString, IsNotEmpty, IsNumber, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0) 
    price: number;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsUrl()
    @IsNotEmpty()
    imageUrl: string;

    @IsNumber()
    @Min(0)
    quantity: number;

    @IsString()
    @IsNotEmpty()
    userId: string;
}
