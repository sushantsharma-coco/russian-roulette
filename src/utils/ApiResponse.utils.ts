export class ApiResponse extends Response {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  constructor(statusCode: number, data: any, message: string = "success") {
    super(message);

    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
