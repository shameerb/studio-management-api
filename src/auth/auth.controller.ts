import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokenRequestDto } from './dto/token-request.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get access token (OAuth 2.0 Client Credentials)',
    description: `
      Exchange your client credentials for a JWT access token.

      **How it works:**
      1. Send your \`client_id\` (API Key ID) and \`client_secret\` (API Key)
      2. Receive a JWT token valid for 1 hour
      3. Use this token in the Authorization header: \`Bearer <token>\`
      4. When the token expires, request a new one

      **Benefits over API keys:**
      - Stateless validation (no database lookup per request)
      - Short-lived tokens (better security)
      - Industry standard (OAuth 2.0)
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Token generated successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid client credentials',
  })
  async getToken(@Body() dto: TokenRequestDto): Promise<TokenResponseDto> {
    return this.authService.generateToken(dto.client_id, dto.client_secret);
  }
}
