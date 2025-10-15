import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class TokenRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['client_credentials'])
  grant_type: string;

  @IsString()
  @IsNotEmpty()
  client_id: string;

  @IsString()
  @IsNotEmpty()
  client_secret: string;
}
