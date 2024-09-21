import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { Matches, ValidateNested } from 'class-validator';

class CreatePayloadAuthDto {
  @IsNotEmpty()
  @IsEmail({ message: 'The email you entered is not in the correct format' })
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsNotEmpty()
  @IsString({ message: 'Please enter your account name string' })
  account_name: string;
}

export class CreateAuthDto {
  @ValidateNested()
  @Type(() => CreatePayloadAuthDto)
  payload: CreatePayloadAuthDto;
}
