import { Injectable, NotFoundException } from '@nestjs/common';
import { Product} from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from 'src/category/category.service';
import { UsersService } from 'src/auth/users/users.service';


@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private productModel: Model<Product>,
        private categoryService: CategoryService,
        private userService: UsersService,
        
    ){
        console.log('all loaded');
    }

    async createProduct(createProductDto: CreateProductDto, userId: string): Promise<Product | undefined>{
        const category = await this.categoryService.findById(createProductDto.categoryId);
        if (!category) {
          throw new NotFoundException('Category not found');
        }
    /*
        const user = await this.userService.findById(createProductDto.userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
    */
        const createdProduct = new this.productModel({
          ...createProductDto,
          category: category._id,
          user: userId,
        });
        return createdProduct.save();
    }

    async findAll():Promise<Product[]>{
        return this.productModel.find().exec();
    }

    async findById(_id: string): Promise<Product | undefined> {
        return this.productModel.findById(new Types.ObjectId(_id)).exec();
    }

    async findByName(name: string): Promise<Product | undefined>{
        return this.productModel.findOne({name}).exec();
    }

    async findByPriceRange(minPrice: number, maxPrice: number):Promise<Product[]>{
        return this.productModel.find({price: {$gte: minPrice, $lte: maxPrice}}).exec();
    }

    async findByCategory(categoryId: string): Promise<Product[]> {
        return this.productModel.find({ category: new Types.ObjectId(categoryId)  }).exec();
    }
    
    async findByCreatedAtRange(startDate: Date, endDate: Date): Promise<Product[]> {
        return this.productModel.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).exec();
    }

    async updateProduct(_id:string, updateProductDto: UpdateProductDto): Promise<Product | undefined>{
        return this.productModel.findByIdAndUpdate(_id, updateProductDto, {new: true}).exec();
    }

    async deleteProduct(_id: string): Promise<any>{
        return this.productModel.findByIdAndDelete(_id).exec();
    }
      
}
