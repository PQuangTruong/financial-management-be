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

  @IsString()
  saving_type: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  saving_date: Date;

  @IsString()
  category_id: string;
}

export class CreateSavingDto {
  @ValidateNested()
  @Type(() => CreatePayloadSavingDto)
  payload: CreatePayloadSavingDto;
}
