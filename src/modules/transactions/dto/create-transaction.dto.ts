import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  ValidateNested,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreatePayloadTransactionDto {
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

export class CreateTransactionDto {
  @ValidateNested()
  @Type(() => CreatePayloadTransactionDto)
  payload: CreatePayloadTransactionDto;
}
