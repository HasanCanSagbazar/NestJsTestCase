import { Body, Controller, Get, Request, Param, Post, UseGuards, NotFoundException, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from 'src/category/category.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { User } from 'src/auth/users/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuards } from 'src/auth/guards/roles.guards';
import { AccessTokenGuard } from 'src/auth/guards/accesstoken.guard';


@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService
    ){
        console.log('ProductService loaded');
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllProducts(){
        return this.productService.findAll();
    }

    @UseGuards(AccessTokenGuard, AuthGuard(), JwtAuthGuard,RolesGuards)
    @Roles(Role.Admin)
    @Post()
    async create(@Body() createProductDto: CreateProductDto, @Request() req) {
        const userId = req.user.id;
        return this.productService.createProduct(createProductDto, userId);
    }

    @Get('category')
    async findByCategory(@Query('categoryId') categoryId: string){
        const category = await this.categoryService.findById(categoryId);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return this.productService.findByCategory(categoryId);
    }
}
