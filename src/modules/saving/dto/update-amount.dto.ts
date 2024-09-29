import { PartialType } from '@nestjs/mapped-types';
import { CreateSavingDto } from './create-saving.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePayloadSavingAmountDto {
  @IsString()
  card_id: string;
  @IsNumber()
  saving_amount: number;
}

export class UpdateSavingAmountDto {
  @ValidateNested()
  @Type(() => UpdatePayloadSavingAmountDto)
  payload: UpdatePayloadSavingAmountDto;
}
