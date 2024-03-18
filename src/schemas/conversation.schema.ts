import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BaseSchema } from './base.schema';
import { User } from './user.schema';
import { Message } from './message.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({
  timestamps: true,
  collection: 'conversations',
})
export class Conversation extends BaseSchema {
  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: User.name }] })
  participants: Types.ObjectId[];

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Message.name }],
    default: [],
  })
  messages: Types.ObjectId[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
