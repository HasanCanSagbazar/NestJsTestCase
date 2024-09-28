import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from '../guards/accesstoken.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuards } from '../guards/roles.guards';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('users')
@UseGuards(AccessTokenGuard)
@Roles(Role.Admin)
@UseGuards(AuthGuard(), RolesGuards)
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private userService: UsersService
    ){}

    @Get()
    async findAll(){
        return this.userService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id:string){
        return this.userService.findById(id);
    }

    @Get('username/:username')
    async findOneByUsername(@Param('username') username: string) {
        return this.userService.findOneByUsername(username);
    }

    @Get('premium')
    async findPremiumUsers() {
        return this.userService.findPremiumUsers();
    }

    @Put(':id')
    async updateUser(@Param('id') id:string, @Body() updateData:any){
        return this.userService.updateUser(id, updateData);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id:string){
        return this.userService.deleteUser(id)
    }

}
