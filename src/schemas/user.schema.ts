import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from './base.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  avatar: string;

  @Prop([String])
  roles: string[];

  @Prop({ required: false })
  provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
