import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from 'src/auth/users/users.service';
import { OrderItem } from './schema/order-item.schema';
import { ProductService } from 'src/product/product.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateUserDto } from 'src/auth/dto/updateUser.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name)
        private orderModel:Model<Order>,
        @InjectModel(OrderItem.name)
        private orderItemModel: Model<OrderItem>,
        private usersService: UsersService,
        private productService: ProductService,
    ){}

    async createOrder(createOrderDto: CreateOrderDto, userId:string): Promise<Order |undefined>{
        const {items} = createOrderDto;

        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const orderItems: OrderItem[] = [];
        let total = 0;

        for(const item of items){
            
            const product = await this.productService.findById(item.productId);
            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }

            const orderItem = this.orderItemModel.create({
                product,
                quantity: item.quantity,
                price: product.price * item.quantity,
            });

            orderItems.push(await orderItem);
            total += (await orderItem).price;
        }

        const order = await this.orderModel.create({
            user: new Types.ObjectId(userId),
            status: 'placed',
            totalAmount: total,
            items: orderItems
        });

        const updateUserDto = new UpdateUserDto();
        updateUserDto.isPremium = true;

        this.usersService.updateUser(user.id, updateUserDto);

        return order.save();
    }

    async findOneByUserId(userId: string): Promise<Order[]>{
        return this.orderModel.find({user: new Types.ObjectId(userId)}).exec();
    }

    async findAllOrders(): Promise<Order[]>{
        return this.orderModel.find().exec();
    }

    async findOrderById(id: string):Promise<Order | undefined>{
        const _id = new Types.ObjectId(id);
        return this.orderModel.findById(_id).exec();
    }

    async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
       
        return this.orderModel.findByIdAndUpdate(new Types.ObjectId(id), updateOrderStatusDto, {new: true}).exec();
    }

    async removeOrder(id: string): Promise<void> {
        const order = await this.findOrderById(id);
        if (!order) {
          throw new NotFoundException('Order not found');
        }
        await this.orderModel.findByIdAndDelete(id).exec();
      }
}
