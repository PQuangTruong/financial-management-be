import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  card_id: string;

  @IsNotEmpty()
  @IsNumber()
  trans_amount: number;

  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  trans_type: string;

  @IsString()
  category_name?: string;

  @IsString()
  trans_note?: string;
}
