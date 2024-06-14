import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { localStrategy } from './utils/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './utils/at.jwt';
import { RefreshTokenStrategy } from './utils/rt.jwt';
import { UserService } from '../user/user.service';
import { AUTH_SERVICE, USER_SERVICE } from '../token';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    localStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
