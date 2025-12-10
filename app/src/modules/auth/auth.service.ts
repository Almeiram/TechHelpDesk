import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

// decorator who sets a standard for the AuthService
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: any) {
    const existing = await this.usersService.findByEmail(createUserDto.email);
    if (existing) throw new UnauthorizedException('Email already in use');
    // Accept either { fullname, email, password } or CreateUserDto { name, email, password }
    const payload: any = { ...createUserDto };
    if (payload.fullname && !payload.name) payload.name = payload.fullname;
    const user = await this.usersService.create(payload);
    const { password, ...result } = user as any;
    return result;
  }

};
