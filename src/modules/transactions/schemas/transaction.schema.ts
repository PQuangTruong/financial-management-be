import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  transaction_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Card' })
  card_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Savings' })
  savings_id: Types.ObjectId;

  @Prop({ enum: ['income', 'expense'], required: true })
  trans_type: string;

  @Prop({ required: true })
  trans_amount: number;

  @Prop({ required: true })
  category_name: string;

  @Prop({ required: true })
  card_number: string;

  @Prop()
  trans_note: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
