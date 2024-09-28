import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './schema/category.schema';
import { AccessTokenGuard } from 'src/auth/guards/accesstoken.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuards } from 'src/auth/guards/roles.guards';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ){
        console.log('CategoryService loaded');
    }
    
    
    @UseGuards(AuthGuard(),RolesGuards, AccessTokenGuard, JwtAuthGuard)
    @Roles(Role.Admin)
    @Post()
    async create(@Body() createCategoryDto:CreateCategoryDto):Promise<Category | undefined>{
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    async findAll(): Promise<Category[]>{
      return this.categoryService.findAll();
    }

    @Get('categories/:id')
    async findCategoryById(@Param('id') _id:string): Promise<Category | undefined>{
        return this.categoryService.findById(_id);
    }

    @Put('categories/:id')
    updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
      return this.categoryService.updateCategory(id, updateCategoryDto);
    }
  
    @Delete('categories/:id')
    removeCategory(@Param('id') id: string) {
      return this.categoryService.removeCategory(id);
    }
}
