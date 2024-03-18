import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    console.log('🚀 ~ SocketService ~ handleConnection ~ clientId:', clientId);
    this.connectedClients.set(clientId, socket);

    console.log('socketQuery', socket.handshake.query);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });

    // Handle other events and messages from the client
  }

  handleMessage(message: string, server: Server): void {
    console.log("🚀 ~ SocketService ~ handleMessage ~ message:", message)
    server.emit('message', message);
  }
}
