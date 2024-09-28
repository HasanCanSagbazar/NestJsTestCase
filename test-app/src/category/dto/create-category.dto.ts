import { IsString, IsNotEmpty} from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
  
    @IsNotEmpty()
    @IsString()
    readonly description: string;
}