import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePayloadTransactionDto {
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
export class UpdateTransactionDto {
  @ValidateNested()
  @Type(() => UpdatePayloadTransactionDto)
  payload: UpdatePayloadTransactionDto;
}
