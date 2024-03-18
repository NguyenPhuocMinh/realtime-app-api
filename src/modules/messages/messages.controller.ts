import { Req, Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Role } from '../../enums';
import { RolesDecorator } from '../../common/decorators';

import { MessagesService } from './messages.service';

import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @RolesDecorator(Role.Admin, Role.User)
  @Post('send/:receiverId')
  @ApiBearerAuth()
  sendMessage(
    @Param('receiverId') receiverId: string,
    @Body() sendMessageDto: SendMessageDto,
    @Req() request: Request,
  ) {
    return this.messagesService.sendMessage(
      receiverId,
      sendMessageDto,
      request,
    );
  }

  @RolesDecorator(Role.Admin, Role.User)
  @Get(':receiverId')
  @ApiBearerAuth()
  getAllMessage(
    @Param('receiverId') receiverId: string,
    @Req() request: Request,
  ) {
    return this.messagesService.getAllMessage(receiverId, request);
  }
}
