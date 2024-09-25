import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ValidateNested } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePayloadCategoryDto {
  @IsString()
  @IsOptional()
  cate_name: string;
  @IsString()
  cate_type: string;
}

export class UpdateCategoryDto {
  @ValidateNested()
  @Type(() => UpdatePayloadCategoryDto)
  payload: UpdatePayloadCategoryDto;
}
