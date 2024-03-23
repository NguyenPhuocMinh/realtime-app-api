import { Req, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

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
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @PublicDecorator()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  signOut() {
    return this.authService.signOut();
  }

  @PublicDecorator()
  @Post('login/provider')
  signInProvider(@Body() signInProviderDto: SignInProviderDto) {
    return this.authService.signInProvider(signInProviderDto);
  }

  @RolesDecorator(Role.Admin, Role.User)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Req() request: Request) {
    return this.authService.getProfile(request);
  }
}
