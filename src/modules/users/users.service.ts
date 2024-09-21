import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { hashPassword } from '@/others/password_custom';
import { CreateAuthDto } from '../auths/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private userModal: Model<Users>,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModal.exists({ email });
    if (user) return true;
    return false;
  };

  // CreateUser Func
  async createUser(payload: CreateUserDto) {
    const { name, email, password, phone, address, image } = payload;
    const isExisted = this.isEmailExist(email);
    if (isExisted) {
      throw new BadRequestException(
        `Email is exist: ${email}. Please use another email!`,
      );
    }
    const hashPass = await hashPassword(payload.password);
    const user = await this.userModal.create({
      name: payload?.name,
      email: payload?.email,
      password: hashPass,
      phone: payload?.phone,
      address: payload?.address,
      image: payload?.image,
    });

    return user;
  }

  async findByEmail(email: string) {
    return await this.userModal.findOne({ email });
  }

  // Register Func
  handleRegister = async (payload: CreateAuthDto) => {
    const { name, email, password } = payload;
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email is exist: ${email}. Please use another email!`,
      );
    }
    const hashPass = await hashPassword(password);

    const user = await this.userModal.create({
      name: payload?.name,
      email: payload?.email,
      password: hashPass,
      is_active: false,
    });

    return user;
  };

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
