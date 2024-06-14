import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { USER_SERVICE } from '../token';
import { UserService } from './user.service';
import { UserDto } from '../DTO/user.dto';
import { Public } from '../utils/public.decorator';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  @Public()
  @Post('signup')
  createUser(@Body() createUser: UserDto) {
    return this.userService.createUser(createUser);
  }

  @Public()
  @Get('verifyemail/:token')
  verifyEmail(@Param('token') token: string) {
    return this.userService.verifyEmail(token);
  }

  @Public()
  @Get('forgotpassword/:email')
  sendPasswordResetMail(@Param('email') email: string) {
    return this.userService.sendPasswordResetMail(email);
  }

  @Public()
  @Post('resetpassword')
  resetPassword(@Body() userData: any) {
    return this.userService.resetPassword(userData.token, userData.password);
  }
}
