import { Controller, Param, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {

    constructor(
        private invoiceService: InvoiceService
    ) {}
    
    @Post('invoices/:id')
    async create(@Param('id') id:string ) {
        const invoice = await this.invoiceService.createOneInvoice(id);
        return invoice; 
    }
}
