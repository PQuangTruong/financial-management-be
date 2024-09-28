import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateTransactionDto {
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
