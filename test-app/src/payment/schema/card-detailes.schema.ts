import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type CardDetailsDocument = CardDetails & Document;

@Schema({timestamps:true})
export class CardDetails {
    @Prop({ required: true })
    number: string;

    @Prop({ required: true })
    exp_month: number;

    @Prop({ required: true })
    exp_year: number;

    @Prop({ required: true })
    cvc: string;
}


export const CardDetailsSchema = SchemaFactory.createForClass(CardDetails);
