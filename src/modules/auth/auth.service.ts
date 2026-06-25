import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Role } from '@prisma/client';
import { SafeUser } from '../users/dto/safe-user.dto';

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private users: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.users.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.users.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role: Role.user,
    });

    const tokens = this.generateTokens(user);

    return { user: this.mapUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);

    return { user: this.mapUser(user), ...tokens };
  }

  private generateTokens(user: { id: string; email: string; role: Role }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '4h',
    });

    return { accessToken, refreshToken };
  }

  private mapUser(user: SafeUser) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email, role: payload.role },
        {
          secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch (e) {
      this.logger.warn(
        `Refresh token validation failed: ${(e as Error).message}`,
      );
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
