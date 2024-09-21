import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auths')
export class AuthsController {
  constructor(private readonly authService: AuthsService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.handleRegister(createAuthDto);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    const { email, password } = body.payload;
    return this.authService.login({ email, password });
  }
}
