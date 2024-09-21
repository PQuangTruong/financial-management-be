import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEmail, Matches } from '@nestjs/class-validator';

export class LoginPayloadDto {
  @IsNotEmpty()
  @IsString()
  account_name: string;

  @IsString()
  password: string;
}

export class LoginDto {
  @ValidateNested()
  @Type(() => LoginPayloadDto)
  payload: LoginPayloadDto;
}
