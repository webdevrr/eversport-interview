import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} | Body: ${JSON.stringify(body)}`
    );

    next();
  }
}
