import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../token';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../utils/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = req.user as any;
    res.cookie('authToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.send(accessToken);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    const user = this.authService.logout(req.user);
    if (user) return 'User logged out successfully';
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  refresh(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = req.user as any;
    res.cookie('authToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.send(accessToken);
  }
}
