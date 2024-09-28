import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class Product extends Document{
    @Prop({ required: true })
    name: string;
  
    @Prop({ required: true })
    description: string;
  
    @Prop({ required: true, type: Number })
    price: number;
  
    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    category: Types.ObjectId;
  
    @Prop({ required: true })
    imageUrl: string; 
  
    @Prop({ required: true })
    quantity: number;
  
    @Prop({ default: Date.now })
    createdAt: Date;
  
    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);