import { Body, Controller, HttpStatus, Param, Post, Request, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@UseGuards(AuthGuard(), JwtAuthGuard)
@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService,
        private configService: ConfigService,
    ){}

    @Post('create-payment-intent/:orderId')
    createPaymentIntent(@Param('orderId') orderId:string, @Body() createPaymentDto: CreatePaymentDto){
        const {payment_method_data} = createPaymentDto;
        return this.paymentService.createPaymentIntent(orderId, payment_method_data);
    }
/*
    @Post('webhook')
    async handleWeebHook(@Request() req, @Res() res){
        const sign = req.headers['stripe-signature'];
        const webhookSecret = this.configService.get<string>('WEBHOOK_SECRET_KEY');
        console.log("Stripe Signature:", req.headers['stripe-signature']);

        if (!sign) {
            console.log("Missing stripe-signature header");
            return res.status(HttpStatus.BAD_REQUEST).send("Missing stripe-signature header");
        }
        //return this.paymentService.handleWebHook(sign, req.body, webhookSecret);

        try {
            res.status(HttpStatus.OK).send({ received: true }); 
            return this.paymentService.handleWebHook(sign, req.body, webhookSecret);
        } catch (error) {
            
            res.status(HttpStatus.BAD_REQUEST).send(`${error.message}`);
        }
    }
*/

    @Post('confirm/:orderId')
    async confirmPayment(@Param('orderId') orderId:string, @Body() body: { paymentIntentId: string }) {
        const paymentIntent = await this.paymentService.confirmPayment(body.paymentIntentId, orderId);
        return paymentIntent;
    }

    @Post('invoices/:id')
    async createInvoice(@Param('id') id:string) {
        return await this.paymentService.createInvoice(id);
    }

}
