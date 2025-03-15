import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Response } from "express";
import { EversportException } from "./eversport.exception";

@Catch(EversportException)
export class EversportExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(EversportExceptionFilter.name);

  catch(exception: EversportException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    this.logger.error(`HTTP Error: ${status} - ${message}`);

    response.status(status).json({
      message
    });
  }
}
