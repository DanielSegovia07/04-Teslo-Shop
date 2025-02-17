import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket } from 'socket.io';
import { Delete } from '@nestjs/common';
import { first } from 'rxjs';

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messageWsService: MessageWsService) {
    
  }
  handleConnection(client: Socket) {
    // console.log('Cliente conectado', client.id)
    this.messageWsService.registerClient(client)



  }
  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id)
    this.messageWsService.removeClient(client.id)
    console.log({conectados : this.messageWsService.getConnectedClients()})
  }
}
