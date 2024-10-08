import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Saving extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Card' })
  card_id: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category_id: string;

  @Prop({ ref: 'Category' })
  cate_name: string;

  @Prop()
  saving_goals_amount: number;

  @Prop()
  saving_total_amount: number;

  @Prop({ required: true })
  saving_amount: number;

  @Prop({ type: Date })
  saving_date: Date;

  @Prop()
  saving_option: string;

  @Prop()
  category_name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: string;
}

export const savingSchema = SchemaFactory.createForClass(Saving);
