import { IsNotEmpty, IsOptional } from '@nestjs/class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  name: string;
}
