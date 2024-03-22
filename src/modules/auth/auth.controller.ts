import { Req, Res, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { Role } from '../../enums';
import { PublicDecorator, RolesDecorator } from '../../common/decorators';

import { AuthService } from './auth.service';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignInProviderDto } from './dto/sign-in-provider.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicDecorator()
  @Post('register')
  signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signUp(signUpDto, response);
  }

  @PublicDecorator()
  @Post('login')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(signInDto, response);
  }

  @Post('logout')
  @ApiBearerAuth()
  signOut(@Res({ passthrough: true }) response: Response) {
    return this.authService.signOut(response);
  }

  @PublicDecorator()
  @Post('login/provider')
  signInProvider(
    @Body() signInProviderDto: SignInProviderDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signInProvider(signInProviderDto, response);
  }

  @RolesDecorator(Role.Admin, Role.User)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Req() request: Request) {
    return this.authService.getProfile(request);
  }
}
