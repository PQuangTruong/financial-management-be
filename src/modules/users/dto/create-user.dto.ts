import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class CreateUserDto {
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  phone: number;

  address: string;

  image: string;

  gender: boolean;
}
