export class RedisError extends Error {
  errorMessage: string | any;
  statusCode: number;

  constructor(statusCode: number, errorMessage: string | any) {
    super(errorMessage);
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }
}
