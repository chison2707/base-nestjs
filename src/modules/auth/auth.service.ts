/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from './dto/auth.request.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from '../User/user.interface';
import { IJwtPayload, loginResponse } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prima: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async login(request: AuthRequest): Promise<loginResponse> {
    const user = await this.validateUser(request.email, request.password);
    if (!user) {
      throw new UnauthorizedException('Email hoac mật khẩu không đúng');
    }

    const payload = { sub: user.id.toString() };

    const acccessToken = await this.jwtService.signAsync(payload);
    const refreshToken = randomBytes(32).toString('hex');
    const crsfToken = randomBytes(32).toString('hex');

    await this.cacheManager.set('test', '123', 6000);

    return this.authResponse(acccessToken, crsfToken);
  }

  authResponse(acccessToken: string, crsfToken: string): loginResponse {
    const decoded = this.jwtService.decode<IJwtPayload>(acccessToken);
    const expiresAt = decoded.exp - Math.floor(Date.now() / 1000);

    return {
      accessToken: acccessToken,
      expiresAt: expiresAt,
      tokenType: 'Bearer',
      crsfToken: crsfToken,
    };
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
