import { ApiProperty } from '@nestjs/swagger';

export class ClassResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  venueId: string;

  @ApiProperty({ example: 'Morning Vinyasa Flow' })
  name: string;

  @ApiProperty({ example: 'Start your day with an energizing vinyasa flow', required: false })
  description?: string;

  @ApiProperty({ example: 'Sarah Johnson', required: false })
  instructorName?: string;

  @ApiProperty({ example: '2024-01-20T07:00:00Z' })
  startTime: Date;

  @ApiProperty({ example: '2024-01-20T08:00:00Z' })
  endTime: Date;

  @ApiProperty({ example: 20 })
  spotsTotal: number;

  @ApiProperty({ example: 15 })
  spotsAvailable: number;

  @ApiProperty({ example: 25.00 })
  price: number;

  @ApiProperty({ example: 'Intermediate', required: false })
  difficultyLevel?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;
}

export class ClassListResponseDto {
  @ApiProperty({ type: [ClassResponseDto] })
  data: ClassResponseDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;
}
