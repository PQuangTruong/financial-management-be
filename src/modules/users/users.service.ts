import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from '@/others/password-custom';
import { CreateAuthDto } from '../auths/dto/register-auth.dto';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import RandomNumber from '@/others/random-code';

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
