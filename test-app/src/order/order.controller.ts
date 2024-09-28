import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuards } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(AuthGuard(), JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService,
    ){}

    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        const userId = req.user.id;
        return this.orderService.createOrder(createOrderDto, userId);
    }

    @UseGuards(RolesGuards)
    @Roles(Role.Admin)
    @Get()
    async findAllOrders() {
        return this.orderService.findAllOrders();
    }

    @Get('orders/my-orders')
    async findOrderByUserself(@Request() req){
        const userId = req.user.id;
        return this.orderService.findOneByUserId(userId);
    }

    @Get('orders/:id')
    async findOrderById(@Param('id') id: string) {
        
        return this.orderService.findOrderById(id);
    }

    @Put('orders/:id/status')
    updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
    }

    @Delete('orders/:id')
    removeOrder(@Param('id') id: string) {
      return this.orderService.removeOrder(id);
    }
}
