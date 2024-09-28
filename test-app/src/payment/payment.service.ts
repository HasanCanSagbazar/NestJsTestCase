import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/auth/users/users.service';
import { UpdateOrderStatusDto } from 'src/order/dto/update-order-status.dto';
import { OrderService } from 'src/order/order.service';
import { Order } from 'src/order/schema/order.schema';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(
        @InjectModel(Order.name)
        private orderModel:Model<Order>,
        private orderService: OrderService,
        private configService: ConfigService,
        private userService: UsersService,
    ){
        const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        this.stripe = new Stripe(stripeSecretKey,  {apiVersion: '2024-06-20'});
    }

    async createPaymentIntent(orderId: string, payment_method_data:any): Promise<Stripe.PaymentIntent>{
        try {
            const order = await this.orderService.findOrderById(orderId);
            if (!order) {
                throw new BadRequestException('Order not found');
            }
/*
            const paymentMethod = await this.stripe.paymentMethods.create({
                type: payment_method_data.type,
                card: {
                  number: payment_method_data.card.number,
                  exp_month: payment_method_data.card.exp_month,
                  exp_year: payment_method_data.card.exp_year,
                  cvc: payment_method_data.card.cvc,
                },
              });
*/   
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(order.totalAmount * 100),
                currency: 'usd',
                payment_method: 'pm_card_visa',
                confirm: true, 
                return_url: "http://localhost:3000",
                metadata: { orderId: order.id.toString()
                },
            });
    
            return paymentIntent;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw new InternalServerErrorException('Error creating payment intent: ' + error.message);
        }
    }
/*
    async handleWebHook(signature: string, payload: any, webhookSecret: string): Promise<any>{
        let event: Stripe.Event;
        
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            console.log("Event constructed successfully");
        } catch (err) {
            console.log(`Webhook signature verification failed: ${err.message}`);
            throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
        }
        console.log("Received event type:", event.type);
        if(event.type === 'payment_intent.succeeded'){
            console.log("heer");
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const orderId = paymentIntent.metadata.orderId;

            const order = await this.orderService.findOrderById(orderId);

            if(order){
                const updateOrderStatusDto = new UpdateOrderStatusDto;
                updateOrderStatusDto.status = 'paid';
                await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
            }
        }
    }
*/

    async confirmPayment(paymentIntentId: string, orderId: string) {
        const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
        
        const order = await this.orderService.findOrderById(orderId);

            if(order){
                const updateOrderStatusDto = new UpdateOrderStatusDto;
                updateOrderStatusDto.status = 'paid';
                await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
            }
        return paymentIntent;
    }

    async createInvoice(orderId: string): Promise<any>{
        const order = await this.orderService.findOrderById(orderId);
        const user = await this.userService.findById(order.user._id.toString());
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        try {
            const customer = await this.stripe.customers.create({
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
            })

            const invoiceItems = order.items.map(item => 
                    this.stripe.invoiceItems.create({
                    customer: customer.id,
                    amount: Math.round(item.price * item.quantity * 100), 
                    currency: 'usd', 
                    description: item.product.name,
                })
            );

            await Promise.all(invoiceItems);

            const invoice = await this.stripe.invoices.create({
                customer: customer.id,
                auto_advance: true, 
            });
        
            console.log('Invoice created', invoice);
            return invoice;
        } catch (error) {
            console.error('Invoice creating error:', error);
        }
        
    }

}
