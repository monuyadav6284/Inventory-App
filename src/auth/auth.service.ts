import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { compareHash, encrypt } from './utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { USER_SERVICE } from '../token';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(USER_SERVICE) private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async logout(user: any) {
    return await this.userModel.updateOne(
      { email: user.email },
      { $unset: { edRt: '' } },
    );
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) return null;
    if (!user.verified) {
      {
        await this.userService.sendVerifyEmail(email);
        throw new BadRequestException('Please verify your email first');
      }
    }
    const { password: passwordHash } = user;
    if (!compareHash(password, passwordHash)) return null;
    return this.generateTokens(user._id, user.username, user.email);
  }

  async refreshToken(rt: string, email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Session timeout login again');
    const { hashedRt } = user;
    if (!hashedRt)
      throw new UnauthorizedException('Session timeout login again');
    if (!compareHash(rt, hashedRt)) return null;
    return this.generateTokens(user._id, user.username, user.email);
  }

  async generateTokens(
    id: mongoose.Types.ObjectId,
    username: string,
    email: string,
  ) {
    const accessToken = this.jwtService.sign(
      { id, username, email },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      },
    );
    const refreshToken = this.jwtService.sign(
      { email },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '2h',
      },
    );
    const rtHash = encrypt(refreshToken);
    await this.userModel.updateOne({ email }, { hashedRt: rtHash });
    return { accessToken, refreshToken };
  }
}
