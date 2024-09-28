import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// DTO cho thông tin thẻ
export class UpdatePayloadCardDto {
  @IsOptional() // Thuộc tính này là không bắt buộc
  @IsString()
  card_code?: string;

  @IsOptional() // Thuộc tính này là không bắt buộc
  @IsNumber()
  card_number?: number;

  @IsOptional() // Thuộc tính này là không bắt buộc
  @IsNumber()
  card_amount?: number;
}

// DTO cho thông tin giao dịch
export class TransactionDto {
  @IsNumber()
  trans_amount: number; // Số tiền giao dịch

  @IsEnum(['income', 'expense', 'saving']) // Chỉ cho phép hai loại giao dịch này
  trans_type: string; // Loại giao dịch
}

// DTO chính để cập nhật thẻ
export class UpdateCardDto extends PartialType(UpdatePayloadCardDto) {
  @ValidateNested()
  @Type(() => UpdatePayloadCardDto)
  payload: UpdatePayloadCardDto;

  @ValidateNested()
  @Type(() => TransactionDto)
  transaction: TransactionDto; // Thêm transaction vào đây
}
