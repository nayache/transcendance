import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { ErrorDto } from 'src/dto/error.dto';
import { AboutErr, TypeErr } from 'src/enums/error_constants';
import { ErrorException } from 'src/exceptions/error.exception';
import { Error } from 'src/exceptions/error.interface';
import { ValidationException } from 'src/exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {

  public catch(exception: ValidationException, host: ArgumentsHost) {
    console.log('----BadResquest VALIDATION Exception Filter ----')
    const ctx = host.switchToHttp();
    const status: number = exception.getStatus();
    const response = ctx.getResponse<Response>();
    const error: ErrorDto = (exception.getResponse() as ErrorDto);
    
    response
      .status(status)
      .json(error)
  }

}