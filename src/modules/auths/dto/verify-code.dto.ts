import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNumber } from '@nestjs/class-validator';

export class VerifyCodePayloadDto {
  @IsString()
  email: string;
  @IsNumber()
  codeId: number;
}

export class VerifyCodeDto {
  @ValidateNested()
  @Type(() => VerifyCodePayloadDto)
  payload: VerifyCodePayloadDto;
}
