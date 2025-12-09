import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any = { success: false, message: 'Internal server error', error: null };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exc = exception.getResponse();
      if (typeof exc === 'string') {
        responseBody.message = exc;
      } else if (typeof exc === 'object' && exc !== null) {
        // Try to extract message and errors if provided
        // exc can be { message: string | string[], error?: any }
        // or a validation object
        const anyExc: any = exc;
        responseBody.message = anyExc.message || responseBody.message;
        responseBody.error = anyExc.error || null;
      }
    } else if (exception instanceof Error) {
      responseBody.message = exception.message;
      responseBody.error = null;
    }

    response.status(status).json({
      success: false,
      message: responseBody.message,
      error: responseBody.error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
