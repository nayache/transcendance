import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ErrorDto } from 'src/dto/error.dto';
import { AboutErr } from 'src/enums/error_constants';
import { Error } from 'src/exceptions/error.interface';
import { WsChatError } from 'src/exceptions/ws-chat-error.exception';

@Catch()
export class WsExceptionFilter implements WsExceptionFilter {
  private logger: Logger = new Logger('ChatGateway');

  public catch(exception: WsException, host: ArgumentsHost) {
    console.log('----Auth ChatGateway WSException Filter ----')
    const err : Error = (exception.getError() as ErrorDto).error;
    this.logger.error(`${err.message}`);
    this.handleError(host.switchToWs().getClient(), err);
  }

  public handleError(socket: Socket, err: Error) {
    socket.emit('error', err);
    if (err.about == AboutErr.TOKEN)
      socket.disconnect();
  }
}