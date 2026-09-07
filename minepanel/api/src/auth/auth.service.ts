import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) throw new UnauthorizedException('Tài khoản không hợp lệ');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Mật khẩu không đúng');

    await this.usersService.updateLastLogin(user.id);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id:    user.id,
        email: user.email,
        name:  user.name,
        role:  user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    const { password: _, ...result } = user;
    return result;
  }
}
