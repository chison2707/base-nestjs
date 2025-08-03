import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthRequest } from './dto/auth.request.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body(new ValidationPipe()) request: AuthRequest): unknown {
    try {
      return this.authService.login(request);
    } catch (error) {
      console.log(error);
    }
  }
}
