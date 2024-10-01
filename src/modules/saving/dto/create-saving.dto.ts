import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePayloadSavingDto {
  @IsNumber()
  saving_amount: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  saving_date: Date;

  @IsNumber()
  saving_goal: number;

  @IsString()
  card_id?: string;
  @IsString()
  category_id?: string;
}

export class CreateSavingDto {
  @ValidateNested()
  @Type(() => CreatePayloadSavingDto)
  payload: CreatePayloadSavingDto;
}
