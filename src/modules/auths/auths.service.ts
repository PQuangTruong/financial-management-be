import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async login(payload: { account_name: string; password: string }) {
    const { account_name, password } = payload;
    const user = await this.usersService.findNameAccount(account_name);
    if (!user) {
      throw new BadRequestException(`Account name incorrect.`);
    }
    const isValidPPass = await comparePassword(password, user.password);

    if (!isValidPPass) {
      throw new BadRequestException(`Password incorrect.`);
    }
    if (user.account_type !== 'User' && user.account_type !== 'Admin') {
      throw new BadRequestException('Invalid account type.');
    }
    if (user.is_active === false) {
      throw new BadRequestException('Account is not active');
    }
    const token = this.jwtService.sign({
      userId: user._id,
      account_name: user.account_name,
      email: user.email,
      account_type: user.account_type,
      is_active: user.is_active,
    });

    return {
      message: 'Login successfully',
      token,
      account_type: user.account_type,
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
        const newCodeId = RandomNumber();
        const newExpireTime = dayjs().add(5, 'minutes').toISOString();

        user.code_id = newCodeId;
        user.code_expire = newExpireTime;
        await user.save();

        await this.mailService.sendMail({
          to: user.email,
          subject: 'New Activation Code',
          template: 'register',
          context: {
            account_name: user.account_name || user.email,
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

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
      console.log(decoded);
    } catch (error) {
      throw new UnauthorizedException('The token is invalid or has expired');
    }
  }
}
