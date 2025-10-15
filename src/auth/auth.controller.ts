import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenRequestDto } from './dto/token-request.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @HttpCode(HttpStatus.OK)
  async getToken(@Body() dto: TokenRequestDto): Promise<TokenResponseDto> {
    return this.authService.generateToken(dto.client_id, dto.client_secret);
  }
}
