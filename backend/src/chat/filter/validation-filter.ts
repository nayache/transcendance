import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ErrorDto } from 'src/dto/error.dto';
import { ValidationException } from 'src/exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {

  public catch(exception: ValidationException, host: ArgumentsHost) {
    // console.log('----BadResquest VALIDATION Exception Filter ----')
    const ctx = host.switchToHttp();
    const status: number = exception.getStatus();
    const response = ctx.getResponse<Response>();
    const error: ErrorDto = (exception.getResponse() as ErrorDto);
    
    response
      .status(status)
      .json(error)
  }

}
