import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({timestamps:true})
export class Category extends Document{
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;
  
    @Prop({ required: true })
    description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);