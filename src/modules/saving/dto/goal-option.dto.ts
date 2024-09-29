import { PartialType } from '@nestjs/mapped-types';
import { CreateSavingDto } from './create-saving.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GoalPayloadOptionDto {
  @IsString()
  card_id: string;
  @IsNumber()
  saving_amount: number;
  @IsNumber()
  saving_goal_amount: number;
  @IsString()
  saving_option: string;
}

export class GoalOptionDto {
  @ValidateNested()
  @Type(() => GoalPayloadOptionDto)
  payload: GoalPayloadOptionDto;
}
