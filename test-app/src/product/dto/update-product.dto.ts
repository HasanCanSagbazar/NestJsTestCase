import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    categoryId?: string;

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsNumber()
    @IsOptional()
    quantity?: number;
}
