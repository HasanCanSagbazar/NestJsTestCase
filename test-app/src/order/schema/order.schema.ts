import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderItem, OrderItemSchema } from './order-item.schema';


@Schema({timestamps:true})
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: Date.now })
  orderDate: Date;

  @Prop({ required: true, enum: ['placed', 'shipped', 'delivered', 'cancelled', 'returned'] })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
