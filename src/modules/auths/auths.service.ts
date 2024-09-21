import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/register-auth.dto';
import { UsersService } from '../users/users.service';
import { comparePassword } from '@/others/password-custom';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import RandomNumber from '@/others/random-code';
import { MailerService } from '@nestjs-modules/mailer';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthsService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };

  async login(payload: { email: string; password: string }) {
    const { email, password } = payload;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`Email or password incorrect.`);
    }
    const isValidPPass = await comparePassword(password, user.password);

    if (!isValidPPass) {
      throw new BadRequestException(`Password incorrect.`);
    }
    const token = this.jwtService.sign({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    return {
      message: 'Login successfully',
      token,
    };
  }

  async verifyActivationCode(payload: { email: string; codeId: number }) {
    const { email, codeId } = payload;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.code_id !== codeId) {
      throw new BadRequestException('Invalid activation code');
    }

    const isCodeExpired = dayjs().isAfter(user.code_expire);
    if (isCodeExpired) {
      if (isCodeExpired) {
        // Tạo mã mới
        const newCodeId = RandomNumber();
        const newExpireTime = dayjs().add(5, 'minutes').toISOString();

        user.code_id = newCodeId;
        user.code_expire = newExpireTime;
        await user.save();

        // Gửi mã mới qua email
        await this.mailService.sendMail({
          to: user.email,
          subject: 'New Activation Code',
          template: 'register', // Sử dụng template bạn đã định nghĩa
          context: {
            name: user.name || user.email,
            activationCode: newCodeId,
          },
        });

        return {
          message:
            'Activation code has expired. A new code has been sent to your email.',
          newCodeId,
        };
      }
    }

    user.is_active = true;
    user.code_id = null;
    user.code_expire = null;
    await user.save();

    return { message: 'Account activated successfully' };
  }
}
