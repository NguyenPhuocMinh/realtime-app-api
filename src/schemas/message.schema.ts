import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { User } from './user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true,
  collection: 'messages',
})
export class Message extends BaseSchema {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  senderId: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
