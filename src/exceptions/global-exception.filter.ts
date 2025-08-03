import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from 'src/common/bases/api-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // 500 default
    let message: string = 'Network Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as { message?: string };

        message = responseObj.message || 'Network Error';
      }

      switch (status) {
        case HttpStatus.BAD_REQUEST: // 400
          message = message || 'Dữ liệu không hợp lệ';
          break;
        case HttpStatus.UNAUTHORIZED: // 401
          message = message || 'Bạn cần đăng nhập để thực hiện hành động này';
          break;
        default:
          break;
      }
    } else {
      message = 'Lỗi không xác định';
    }

    const apiResponse = ApiResponse.messsage(message, status);
    response.status(status).json(apiResponse);
  }
}
