// Импортируем зависимости
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) { }

  async register(dto: RegisterDto) {
    const hashedPassword = await argon2.hash(dto.password);

 
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashedPassword, name: dto.name },
    });
    return this.generateTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedException('Неверные данные');
    }
    return this.generateTokens(user.id, user.email, user.role);
  }

  async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('Пользователь не найден');
    const userObject = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }
    return userObject;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Неверный токен обновления');
    }
  }

  private generateTokens(userId: number, email: string, role: string) {
    const accessToken = this.jwt.sign({ sub: userId, email, role }, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = this.jwt.sign({ sub: userId }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}