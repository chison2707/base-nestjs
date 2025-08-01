/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthRequest {
  @IsEmail({}, { message: 'Vui lòng nhập đúng định dạng email' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
