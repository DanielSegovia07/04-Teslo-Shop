import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { Delete } from '@nestjs/common';
import { first } from 'rxjs';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer() wss : Server
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly JwtService: JwtService
  ) {
    
  }
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload
    try {
      payload =   this.JwtService.verify(token)
      await this.messageWsService.registerClient(client, payload.id)
    } catch (error) {
      client.disconnect()
      return
    }
    
    // console.log({payload})
    // console.log({token})
    // console.log(client)
    // console.log('Cliente conectado', client.id)
   


    // client.join('ventas')
    // client.join(client.id)
    // // client.join(user.email)
    // this.wss.to('ventas').emit('')

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())



  }
  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id)
    this.messageWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client : Socket,payload: NewMessageDto){
    // console.log(client.id,payload)
    // client.broadcast.emit('message-from-server',{
    //   fullName: 'soy yo',
    //   message: payload.message || 'no-message'
    // })
    
    this.wss.emit('message-from-server',{
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    })
  }
}
