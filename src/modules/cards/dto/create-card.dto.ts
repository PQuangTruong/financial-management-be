import { IsNumber } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class CreatePayloadCardDto {
  // @IsString()
  // account_id: string;
  @IsString()
  card_code: string;
  @IsNumber()
  card_number: number;
  @IsNumber()
  card_amount: number;
}

export class CreateCardDto {
  @ValidateNested()
  @Type(() => CreatePayloadCardDto)
  payload: CreatePayloadCardDto;
}
