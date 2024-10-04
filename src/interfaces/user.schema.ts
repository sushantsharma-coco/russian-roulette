export interface IUserSchema extends Document {
  name: string;
  email: string;
  password: string;
  mobileNumber: number;
  role: string;
  isValid: boolean;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
}
