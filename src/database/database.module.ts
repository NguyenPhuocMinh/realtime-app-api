import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
// configs
import { APP_MONGO_URL } from '../configs';

// schemas
import { User, UserSchema } from '../schemas/user.schema';
import { Message, MessageSchema } from '../schemas/message.schema';
import {
  Conversation,
  ConversationSchema,
} from '../schemas/conversation.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const options: MongooseModuleFactoryOptions = {
          uri: configService.get<string>(APP_MONGO_URL),
          connectionFactory: (connection) => {
            connection.set('debug', true);
            return connection;
          },
        };

        return options;
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
