//Phải xài type của class-transformer ko nên xài của nestjs => bug mò lâu
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';

export class UpdatePayloadUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  phone: number;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  image: string;
}

export class UpdateUserDto {
  @ValidateNested()
  @Type(() => UpdatePayloadUserDto)
  payload: UpdatePayloadUserDto;
}
