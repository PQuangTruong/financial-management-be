import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ValidateNested } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePayloadCategoryDto {
  @IsString()
  @IsNotEmpty()
  cate_name: string;
}

export class UpdateCategoryDto {
  @ValidateNested()
  @Type(() => UpdatePayloadCategoryDto)
  payload: UpdatePayloadCategoryDto;
}
