import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePayloadTransactionDto {
  @IsNumber()
  trans_amount: number;

  @IsString()
  trans_type: string;

  @IsString()
  trans_note?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  trans_date: Date;

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
