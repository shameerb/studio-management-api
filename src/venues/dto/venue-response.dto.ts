import { ApiProperty } from '@nestjs/swagger';

export class VenueResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Zen Yoga Studio' })
  name: string;

  @ApiProperty({ example: 'contact@zenyoga.com' })
  email: string;

  @ApiProperty({ example: '+1-555-0101', required: false })
  phone?: string;

  @ApiProperty({ example: '123 Peaceful Lane', required: false })
  address?: string;

  @ApiProperty({ example: 'San Francisco', required: false })
  city?: string;

  @ApiProperty({ example: 'CA', required: false })
  state?: string;

  @ApiProperty({ example: '94102', required: false })
  zipCode?: string;

  @ApiProperty({ example: 'US' })
  country: string;

  @ApiProperty({ example: 'A tranquil space for yoga and mindfulness', required: false })
  description?: string;

  @ApiProperty({ example: 'https://zenyoga.com', required: false })
  website?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;
}

export class VenueListResponseDto {
  @ApiProperty({ type: [VenueResponseDto] })
  data: VenueResponseDto[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;
}
