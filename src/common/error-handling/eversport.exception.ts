import { HttpException, HttpStatus } from "@nestjs/common";

import { InternalErrorCode } from "./internal-error-code";

export class EversportException extends HttpException {
  constructor(
    internalCode: InternalErrorCode,
    statusCode = HttpStatus.BAD_REQUEST
  ) {
    super(internalCode, statusCode);
  }
}
