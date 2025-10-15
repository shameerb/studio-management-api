import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  classId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  cooperatorId: string;

  @ApiProperty({ example: 'user_12345' })
  cooperatorUserId: string;

  @ApiProperty({ example: 'req_123456789' })
  idempotencyKey: string;

  @ApiProperty({ example: 'confirmed', enum: ['confirmed', 'cancelled', 'no_show'] })
  status: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  userEmail?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  userName?: string;

  @ApiProperty({ example: '2024-01-20T07:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T07:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ required: false })
  cancelledAt?: Date;

  @ApiProperty({ required: false })
  cancellationNote?: string;
}
