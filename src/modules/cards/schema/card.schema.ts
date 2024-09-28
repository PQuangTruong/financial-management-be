import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { Mongoose, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Card {
  @Prop()
  card_full_name: string;

  @Prop()
  card_short_name: string;

  @Prop()
  card_code: string;
  @Prop()
  card_number: number;
  @Prop()
  card_amount: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
