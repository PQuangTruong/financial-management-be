import { Prop, Schema } from '@nestjs/mongoose';
import { timeStamp } from 'console';

@Schema({
  timestamps: true,
})
export class Card {
  @Prop()
  account_id: string;

  @Prop()
  bank_name: string;
  @Prop()
  card_number: number;
  @Prop()
  total_balance: number;
}
