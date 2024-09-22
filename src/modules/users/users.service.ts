import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePayloadUserDto, UpdateUserDto } from './dto/update-user.dto';
import { Users } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hashPassword } from '@/others/password-custom';
import { CreateAuthDto } from '../auths/dto/register-auth.dto';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import RandomNumber from '@/others/random-code';
import { Type } from '@nestjs/class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private userModal: Model<Users>,
    private readonly mailService: MailerService,
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
  async findNameAccount(account_name: string) {
    return await this.userModal.findOne({ account_name });
  }

  // Register Func
  handleRegister = async (createAuthDto: CreateAuthDto) => {
    const { payload } = createAuthDto;
    const isExist = await this.isEmailExist(payload.email);
    if (isExist) {
      throw new BadRequestException(
        `Email is exist: ${payload.email}. Please use another email!`,
      );
    }
    const hashPass = await hashPassword(payload.password);
    const codeId = RandomNumber();

    const user = await this.userModal.create({
      account_name: payload?.account_name,
      email: payload?.email,
      password: hashPass,
      name: payload?.name ?? null,
      phone: payload?.phone ?? null,
      address: payload?.address ?? null,
      image: payload?.image ?? null,
      is_active: false,
      code_id: codeId,
      code_expire: dayjs().add(5, 'minutes'),
    });

    this.mailService.sendMail({
      to: user.email, // list of receivers
      subject: 'Active your account ✔', // Subject line
      template: 'register',
      context: {
        account_name: user.account_name || user.email,
        activationCode: codeId,
      },
    });

    return user;
  };

  findAll() {
    return `This action returns all users`;
  }

  async getUser(id: string) {
    const user = await this.userModal.findById(id);
    return user;
  }

  async findById(_id: string) {
    const userId = new Types.ObjectId(_id);
    return await this.userModal.findOne({ userId });
  }

  async update(
    _id: string,
    payload: {
      name?: string;
      phone?: number;
      address?: string;
      image?: string;
    },
  ) {
    const user = await this.userModal.findById(_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật các trường nếu có giá trị mới
    user.name = payload.name ?? user.name;
    user.phone = payload.phone ?? user.phone;
    user.address = payload.address ?? user.address;
    user.image = payload.image ?? user.image;

    await user.save();

    return user;
  }
  async delete(id: string) {
    const userDelete = await this.userModal.findById(id);

    if (!userDelete) {
      throw new NotFoundException('User not found');
    }
    await this.userModal.findByIdAndDelete(id);

    return {
      message: 'Delete user successfully',
    };
  }
}
