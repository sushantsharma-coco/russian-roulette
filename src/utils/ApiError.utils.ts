interface data {
  message: string;
  data: null;
}

export class ApiError extends Error {
  statusCode;
  message: string;
  errors: string | undefined;
  data: data;
  success: boolean;

  constructor(
    statusCode: number,
    message: string = "something went wrong",
    errors: string | undefined = "INTERNAL_SERVER_ERROR",
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = { message, data: null };
    this.success = false;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
