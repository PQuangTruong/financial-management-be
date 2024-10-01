import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category_id: string;

  @Prop({ type: Types.ObjectId, ref: 'Card' })
  card_id: string;
  @Prop()
  trans_type: string;

  @Prop({ required: true })
  trans_amount: number;

  @Prop({ type: Date })
  trans_date: Date;

  @Prop()
  category_name: string;

  @Prop()
  card_number: string;

  @Prop()
  trans_note: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
