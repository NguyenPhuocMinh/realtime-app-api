import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, ProjectionType } from 'mongoose';

import { User, UserDocument } from '../../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    this.logger.debug('[START] CreateUser has been start...');

    const user = await this.userModel.create(createUserDto);

    this.logger.debug('[END] CreateUser has been end...');

    return user;
  }

  async getUser(username: string): Promise<any> {
    this.logger.debug('[START] getUser has been start...');

    const filter: FilterQuery<User> = {
      username,
    };

    const projection: ProjectionType<User> = {
      username: 1,
      password: 1,
      gender: 1,
      avatar: 1,
      roles: 1,
      provider: 1,
    };

    const user = await this.userModel.findOne(filter, projection);

    this.logger.debug('[END] getUser has been end...');

    return user;
  }
}
