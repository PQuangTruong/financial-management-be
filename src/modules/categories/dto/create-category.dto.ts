import { IsOptional } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreatePayloadCategoryDto {
  @IsString()
  @IsNotEmpty()
  cate_name: string;
  @IsString()
  cate_type: string;
  @IsOptional()
  @IsString()
  cate_note: string;
}

export class CreateCategoryDto {
  @ValidateNested()
  @Type(() => CreatePayloadCategoryDto)
  payload: CreatePayloadCategoryDto;
}
