import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserSchema = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  image: number;

  // Modal v2.1 :]

  @Prop({ default: 'User' })
  account_type: string;

  @Prop({ default: false })
  is_active: boolean;

  @Prop()
  code_id: number;

  @Prop()
  code_expire: string;
}

export const UserSchema = SchemaFactory.createForClass(Users);
