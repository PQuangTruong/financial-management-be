import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auths/passport/jwt-auth.guard';
import { AuthsService } from '../auths/auths.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthsService,
  ) {}

  @Get('get-user')
  async findUser(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    return this.usersService.getUser(decodedToken.userId);
  }
  @Patch('update-user')
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);

    const { name, phone, address, image } = updateUserDto.payload;
    return await this.usersService.update(decodedToken.userId, {
      name,
      phone,
      address,
      image,
    });
  }

  @Delete('delete-user')
  async removeUser(@Param() id) {
    return this.usersService.delete(id);
  }

  @Patch('change-password')
  async changePassword(
    @Request() req,
    @Body('payload') payload: { oldPassword: string; newPassword: string },
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    if (!payload.oldPassword || !payload.newPassword) {
      throw new BadRequestException(
        'Old password and new password are required',
      );
    }

    return await this.usersService.changePass(decodedToken.userId, payload);
  }
}
