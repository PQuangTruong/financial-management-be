import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  ValidateNested,
} from 'class-validator';

export class CreatePayloadTransactionDto {
  @IsNumber()
  trans_amount: number;

  @IsEnum(['income', 'expense', 'saving'])
  trans_type: string;

  @IsString()
  trans_note?: string;

  @IsString()
  card_id?: string;

  @IsString()
  category_id: string;
}

export class CreateTransactionDto {
  @ValidateNested()
  @Type(() => CreatePayloadTransactionDto)
  payload: CreatePayloadTransactionDto;
}
