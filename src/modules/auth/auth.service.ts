/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRequest } from './dto/auth.request.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from '../User/user.interface';
import { loginResponse } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prima: PrismaService) {}

  async login(request: AuthRequest): Promise<unknown> {
    const user = await this.validateUser(request.email, request.password);
    if (!user) {
      throw new UnauthorizedException('Email hoac mật khẩu không đúng');
    }

    return 'Login successful';
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.prima.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }
}
