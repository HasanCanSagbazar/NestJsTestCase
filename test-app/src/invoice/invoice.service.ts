import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/auth/users/users.service';
import { OrderService } from 'src/order/order.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';


@Injectable()
export class InvoiceService {
    
    constructor(
        private orderService: OrderService,
        private userService: UsersService,
        private configService: ConfigService
    ){}
    async createOneInvoice(orderId: string): Promise<string> {
        const order = await this.orderService.findOrderById(orderId);
        const user = await this.userService.findById(order.user._id.toString());

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const invoicePath = await this.generateInvoicePDF(order, user);

        await this.sendInvoiceEmail(user.email, invoicePath);

        return invoicePath;
    }

    private async generateInvoicePDF(order: any, user: any): Promise<string> {
        const doc = new PDFDocument();
        const invoicePath = `src/invoice/invoice_${order.id}.pdf`;
        doc.pipe(fs.createWriteStream(invoicePath));

        doc.fontSize(20).text('Invoice', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Customer: ${user.firstName} ${user.lastName}`);
        doc.text(`Email: ${user.email}`);
        doc.moveDown();

        doc.text(`Order ID: ${order.id}`);
        doc.text(`Order Date: ${order.orderDate.toISOString().split('T')[0]}`);
        doc.moveDown();

        doc.text('Items:', { underline: true });
        order.items.forEach(item => {
            doc.text(`${item.product.name} - Quantity: ${item.quantity} - Price: $${item.price}`);
        });
        doc.moveDown();

        doc.text(`Total Amount: $${order.totalAmount}`, { underline: true });

        doc.end();

        return invoicePath;
    }

    private async sendInvoiceEmail(recipientEmail: string, invoicePath: string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', 
            port: 587,
            secure: false, 
            auth: {
                user: this.configService.get<string>('SMTP_USERNAME'), 
                pass: this.configService.get<string>('SMTP_PASSWORD'), 
            },
        });

        const mailOptions = {
            from: this.configService.get<string>('SMTP_USERNAME'), 
            to: recipientEmail,
            subject: 'Your Invoice',
            text: 'Please find attached your invoice.',
            attachments: [
                {
                    filename: `invoice_${path.basename(invoicePath)}`,
                    path: invoicePath,
                },
            ],
        };

        await transporter.sendMail(mailOptions);
    }
}
