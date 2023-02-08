import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ErrorDto } from 'src/dto/error.dto';
import { Error } from 'src/exceptions/error.interface';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {

  public catch(exception: HttpException, host: ArgumentsHost) {
    console.log('---- Catch Filter ----')
    const err : Error = (exception.getResponse() as ErrorDto).error;
    this.handleError(host.switchToWs().getClient(), err);
  }

  public handleError(socket: Socket, err: Error) {
    socket.emit('error', err);
    socket.disconnect();
  }
}