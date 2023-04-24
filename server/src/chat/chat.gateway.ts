import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayDisconnect {
  // The server is used to emit events to all clients
  @WebSocketServer()
  server: Server;

  // No db, so we'll just use an array to store stuff in memory
  users: any[] = [];
  messages: any[] = [];

  /**
   * When a user disconnects, we'll remove them from the users array and emit the updated list of users to all clients
   * @param client The socket of the client that disconnected
   * @emits users
   */
  handleDisconnect(client: Socket) {
    this.users = this.users.filter((user) => user.id !== client.id);
    this.server.emit('users', this.users);
  }

  /**
   * When a user joins a chat, we'll add them to the users array and emit the updated list of users to all clients
   * @param client The socket of the client that joined
   * @param payload The payload sent by the client
   * @emits users
   */
  @SubscribeMessage('join')
  join(client: Socket, payload: any) {
    client.join(payload.chatId);
    this.users.push({ id: client.id, ...payload });
    this.server.emit('users', this.users);
  }

  /**
   * When a user requests the messages for them and another user, we will filter the messages array and return the messages that match the sender and recipient
   * @param payload The payload sent by the client
   * @returns The messages that match the sender and recipient
   */
  @SubscribeMessage('request-messages')
  requestMessages(@MessageBody() payload: any) {
    const msgs = this.messages.filter(
      (m) =>
        (m.recipient == payload.recipient && m.sender == payload.sender) ||
        (m.recipient == payload.sender && m.sender == payload.recipient),
    );
    return msgs;
  }

  /**
   * When a user sends a message, we'll add it to the messages array and emit the message to the recipient
   * @param payload The payload sent by the client
   * @emits new message
   */
  @SubscribeMessage('new message')
  newMessage(@MessageBody() payload: any) {
    this.messages.push(payload);
    this.server.to(payload.recipient).emit('new message', payload);
  }
}
