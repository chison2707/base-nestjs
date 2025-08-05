import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthRequest } from './dto/auth.request.dto';
import { ApiResponse, TApiResponse } from 'src/common/bases/api-response';
import { loginResponse } from './auth.interface';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ValidationPipe()) request: AuthRequest,
  ): Promise<TApiResponse<loginResponse>> {
    try {
      const res = await this.authService.login(request);

      return ApiResponse.ok(res, 'Đăng nhập thành công', HttpStatus.OK);
    } catch (error) {
      return ApiResponse.error(
        error,
        'Có lỗi xảy ra trong quá trình đăng nhập',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
