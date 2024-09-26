import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class UpdatePayloadCardDto {
  @IsString()
  card_code?: string;

  @IsNumber()
  card_number?: number;

  @IsNumber()
  card_amount?: number;
}

export class UpdateCardDto extends PartialType(UpdatePayloadCardDto) {
  @ValidateNested()
  @Type(() => UpdatePayloadCardDto)
  payload: UpdatePayloadCardDto;
}
