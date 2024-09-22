import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('get-user/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
  @Patch('update-user/:id')
  async updateUser(
    @Param('id') _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { name, phone, address, image } = updateUserDto.payload;

    return await this.usersService.update(_id, { name, phone, address, image });
  }

  @Delete('delete-user/:id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
