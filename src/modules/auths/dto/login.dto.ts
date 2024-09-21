import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LoginPayloadDto {
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
