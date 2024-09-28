import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Product } from "src/product/schemas/product.schema";

@Schema()
export class OrderItem extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  product: Product;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
