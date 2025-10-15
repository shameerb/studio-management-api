import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenRequestDto {
  @ApiProperty({
    description: 'OAuth 2.0 grant type - must be client_credentials',
    example: 'client_credentials',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['client_credentials'])
  grant_type: string;

  @ApiProperty({
    description: 'Client ID (API Key ID from the platform)',
    example: 'clx1234567890abcdefghijk',
  })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description: 'Client Secret (Your API Key)',
    example: 'sk_live_1234567890abcdefghijklmnopqrstuvwxyz',
  })
  @IsString()
  @IsNotEmpty()
  client_secret: string;
}
