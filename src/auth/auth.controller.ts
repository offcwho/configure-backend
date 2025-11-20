// Импортируем зависимости
import { Body, Controller, Post, Res, Req, UseGuards, UnauthorizedException, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const tokens = await this.authService.register(dto);
    this.setCookies(res, tokens);
    return res.json({ message: 'Регистрация прошла успешно' });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(dto);
    this.setCookies(res, tokens);
    return res.json({ message: 'Вы вошли в свой аккаунт' });
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return await this.authService.getUser(req.user.userId)
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException();
    const tokens = await this.authService.refresh(refreshToken);
    this.setCookies(res, tokens);
    return res.json({ message: 'Токен обновился' });
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Вы вышли из своего аккаунта' });
  }

  private setCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: false, sameSite: 'lax' });
  }
}