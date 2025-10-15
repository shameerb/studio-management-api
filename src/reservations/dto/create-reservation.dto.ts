import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsEmail, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Class ID to reserve' })
  @IsString()
  @IsUUID()
  classId: string;

  @ApiProperty({ example: 'user_12345', description: 'Cooperator user ID (external reference)' })
  @IsString()
  cooperatorUserId: string;

  @ApiProperty({ example: 'req_123456789', description: 'Idempotency key to prevent duplicate bookings' })
  @IsString()
  idempotencyKey: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'User email' })
  @IsOptional()
  @IsEmail()
  userEmail?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'User name' })
  @IsOptional()
  @IsString()
  userName?: string;
}
