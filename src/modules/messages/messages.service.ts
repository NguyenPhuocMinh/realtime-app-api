import {
  Injectable,
  Logger,
  InternalServerErrorException,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { isEmpty } from 'lodash';

import { Message, MessageDocument } from '../../schemas/message.schema';
import {
  Conversation,
  ConversationDocument,
} from '../../schemas/conversation.schema';

import { SendMessageDto } from './dto/send-message.dto';
import { transformMessage } from './transform';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async sendMessage(
    receiverId: string,
    sendMessageDto: SendMessageDto,
    @Request() request,
  ) {
    try {
      this.logger.debug('[START] sendMessage has been start...');

      const { message } = sendMessageDto;
      const { userRequest } = request;
      const senderId = userRequest.userId;

      const filterConversation: FilterQuery<Conversation> = {
        participants: {
          $all: [senderId, receiverId],
        },
      };

      let conversation = await this.conversationModel.findOne(
        filterConversation,
      );

      if (isEmpty(conversation)) {
        conversation = await this.conversationModel.create({
          participants: [senderId, receiverId],
        });
      }

      const newMessage = await this.messageModel.create({
        senderId,
        receiverId,
        message,
      });

      if (newMessage) {
        conversation.messages.push(newMessage._id);
        await conversation.save();
      }

      this.logger.debug('[END] sendMessage has been end...');

      return {
        data: transformMessage(newMessage),
      };
    } catch (error) {
      this.logger.error('[ERROR] sendMessage has been error...', error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async getAllMessage(receiverId: string, @Request() request) {
    try {
      this.logger.debug('[START] getAllMessage has been start...');

      const { userRequest } = request;
      const senderId = userRequest.userId;

      const filter: FilterQuery<Message> = {
        senderId,
        receiverId
      }

      const messages = await this.messageModel.find(filter);

      // const filterConversation: FilterQuery<Conversation> = {
      //   participants: {
      //     $all: [senderId, receiverId],
      //   },
      // };

      // const projectionConversation: ProjectionType<Conversation> = {
      //   __v: 0,
      // };

      // const optionsConversation: QueryOptions<Conversation> = {
      //   populate: [
      //     {
      //       path: 'messages',
      //     },
      //   ],
      // };

      // const conversation = await this.conversationModel.findOne(
      //   filterConversation,
      //   projectionConversation,
      //   optionsConversation,
      // );

      // let data = [];

      // if (isEmpty(conversation)) {
      //   return data;
      // }

      // data = conversation.messages;

      this.logger.debug('[END] getAllMessage has been end...');

      return {
        data: messages,
      };
    } catch (error) {
      this.logger.error(
        '[ERROR] getAllMessage has been error...',
        error.message,
      );
      throw new InternalServerErrorException(error);
    }
  }
}
