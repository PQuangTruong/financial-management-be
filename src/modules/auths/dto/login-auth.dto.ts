import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEmail, Matches } from '@nestjs/class-validator';

export class LoginPayloadDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class LoginDto {
  @ValidateNested()
  @Type(() => LoginPayloadDto)
  payload: LoginPayloadDto;
}
