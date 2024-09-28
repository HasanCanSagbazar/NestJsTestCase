import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import {CreateCategoryDto} from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto';
@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel:Model<Category>
    ){
        console.log('CategoryModel loaded');
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category | undefined> {
        const createdCategory = new this.categoryModel(createCategoryDto);
        return createdCategory.save();
    }

    async findAll():Promise<Category[]>{
        return this.categoryModel.find().exec();
    }

    async findById(id: string): Promise<Category> {
        return this.categoryModel.findById(id).exec();
    }

    
    async updateCategory(_id:string, updateCategoryDto: UpdateCategoryDto): Promise<Category | undefined>{
        return this.categoryModel.findByIdAndUpdate(_id, updateCategoryDto, {new: true}).exec();
    }

    async removeCategory(_id:string): Promise<any>{
        return this.categoryModel.deleteOne({id:_id});
    }
}
