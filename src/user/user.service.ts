import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../DTO/user.dto';
import { encrypt } from '../auth/utils/bcrypt';
import { User } from '../schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUser: UserDto) {
    try {
      this.sendVerifyEmail(createUser.email);
      const userData = {
        ...createUser,
        password: encrypt(createUser.password),
      };
      const newUser = new this.userModel(userData);
      return await newUser.save();
    } catch (error) {
      if (error.code)
        throw new BadRequestException('A user with this email already exists');
      else throw new BadRequestException(error);
    }
  }

  async sendVerifyEmail(email: string) {
    const emailToken = this.jwtService.sign(
      { email },
      { secret: this.configService.get('VERIFY_EMAIL_TOKEN'), expiresIn: '1h' },
    );
    const url = `http://localhost:3000/user/verifyemail/${emailToken}`;

    this.mailerService.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      html: `Please click this link to verify your email: <a href=${url}>${url}</a>`,
    });
  }

  async verifyEmail(token: string) {
    const { email } = this.jwtService.verify(token, {
      secret: this.configService.get('VERIFY_EMAIL_TOKEN'),
    });
    if (!email)
      throw new BadRequestException('Email verification link expired');
    try {
      const user = await this.userModel.updateOne(
        { email },
        { verified: true },
      );
      return 'Email verified successfully';
    } catch {
      throw new BadRequestException('Failed to verify email please try again');
    }
  }

  async sendPasswordResetMail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      return 'There is no account associated with this email please create one';
    const emailToken = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('PASSWORD_RESET_EMAIL_TOKEN'),
        expiresIn: '10m',
      },
    );
    const url = `http://localhost:5173/resetpassword?token=${emailToken}`;

    this.mailerService.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Password',
      html: `Please click this link to reset your password: <a href=${url}>${url}</a>`,
    });

    await this.userModel.updateOne({ email }, { resetPass: emailToken });

    return 'Password reset link sent to your email';
  }

  async resetPassword(token: string, password: string) {
    const { email } = this.jwtService.verify(token, {
      secret: this.configService.get('PASSWORD_RESET_EMAIL_TOKEN'),
    });
    await this.userModel.updateOne(
      { email, resetPass: token },
      { password: encrypt(password), $unset: { resetPass: '' } },
    );
    return 'Password changed successfully';
  }
}
