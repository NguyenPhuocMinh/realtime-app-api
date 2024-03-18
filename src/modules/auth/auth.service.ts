import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { isEmpty } from 'lodash';

import { UsersService } from '../users/users.service';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { transformAuth } from './transform';

import { Gender, Role } from '../../enums';
import {
  hashPass,
  comparePass,
  setAuthorizationCookie,
  clearAuthorizationCookie,
} from '../../common/utils';

import { APP_ENV } from '../../configs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  private readonly appEnv = this.configService.get<string>(APP_ENV);

  async signUp(signUpDto: SignUpDto, response: Response) {
    this.logger.debug('[START] SignUp has been start...');

    const { username, password, gender } = signUpDto;

    const user = await this.usersService.getUser(username);

    /**
     * Check exist user
     */
    if (!isEmpty(user)) {
      this.logger.error('User Is Exits...');
      throw new BadRequestException('User Is Exits');
    }

    const avatar =
      gender === Gender.Male
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const createUserDto: CreateUserDto = {
      username,
      password: await hashPass(password),
      gender,
      avatar,
      roles: [Role.User],
    };

    const data = await this.usersService.createUser(createUserDto);

    const payload = {
      userId: data._id,
      username: data.username,
      roles: Role.User,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    setAuthorizationCookie(response, { accessToken, appEnv: this.appEnv });

    this.logger.debug('[END] SignUp has been end...');
    return {
      data: transformAuth(data),
    };
  }

  async signIn(signInDto: SignInDto, response: Response) {
    this.logger.debug('[START] SignIn has been start...');

    const { username, password } = signInDto;

    const user = await this.usersService.getUser(username);

    /**
     * Check exist user
     */
    if (isEmpty(user)) {
      this.logger.error('User Not Found...');
      throw new UnauthorizedException('User Not Found');
    }

    /**
     * Compare password user
     */
    const isMatch = await comparePass(password, user.password);
    if (!isMatch) {
      this.logger.error('Password User Is Incorrect...');
      throw new BadRequestException('Password User Is Incorrect');
    }

    const payload = {
      userId: user._id,
      username: user.username,
      roles: user.roles,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    setAuthorizationCookie(response, { accessToken, appEnv: this.appEnv });

    this.logger.debug('[END] SignIn has been end...');
    return {
      data: transformAuth(user),
    };
  }

  async signOut(response: Response) {
    this.logger.debug('[START] SignOut has been start...');

    clearAuthorizationCookie(response);

    this.logger.debug('[END] SignOut has been end...');

    return {
      data: {
        message: 'Logout success',
      },
    };
  }

  async getProfile(@Request() request) {
    this.logger.debug('[START] GetProfile has been start...');

    const { userRequest } = request;

    const user = await this.usersService.getUser(userRequest.username);

    this.logger.debug('[END] GetProfile has been end...');
    return {
      data: {
        username: user.username,
        avatar: user.avatar,
        gender: user.gender,
      },
    };
  }
}
