import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ErrorDto } from 'src/dto/error.dto';
import { AboutErr } from 'src/enums/error_constants';
import { Error } from 'src/exceptions/error.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger('ChatGateway');

  public catch(exception: HttpException, host: ArgumentsHost) {
    console.log('----Auth ChatGateway Exception Filter ----')
    const err : Error = (exception.getResponse() as ErrorDto).error;
    this.logger.error(`${err.message}`);
    this.handleError(host.switchToWs().getClient(), err);
  }

  public handleError(socket: Socket, err: Error) {
    socket.emit('error', err);
    if (err.about == AboutErr.TOKEN)
      socket.disconnect();
  }
}