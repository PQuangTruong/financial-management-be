import { PartialType } from '@nestjs/mapped-types';
import { CreateSavingDto } from './create-saving.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePayloadSavingDto {
  @IsOptional()
  @IsString()
  category_id: string;

  @IsOptional()
  @IsNumber()
  saving_goal: number;
}

export class UpdateSavingDto {
  @ValidateNested()
  @Type(() => UpdatePayloadSavingDto)
  payload: UpdatePayloadSavingDto;
}
