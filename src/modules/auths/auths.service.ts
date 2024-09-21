import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import { comparePassword } from '@/others/password_custom';
import { JwtService } from '@nestjs/jwt';
// import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthsService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  };

  async login(payload: { email: string; password: string }) {
    const { email, password } = payload;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`Email hoặc mật khẩu không chính xác.`);
    }
    // Kiểm tra mật khẩu
    const isValidPPass = await comparePassword(password, user.password);

    if (!isValidPPass) {
      throw new BadRequestException(`Email hoặc mật khẩu không chính xác.`);
    }

    // Nếu mật khẩu khớp, tạo JWT token
    const token = this.jwtService.sign({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    return {
      message: 'Đăng nhập thành công',
      token,
    };
  }
}
