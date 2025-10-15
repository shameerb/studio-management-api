import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryClassesDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page', maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ example: '2024-01-20T00:00:00Z', description: 'Filter classes starting from this date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-01-25T23:59:59Z', description: 'Filter classes ending before this date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Intermediate', description: 'Filter by difficulty level' })
  @IsOptional()
  difficultyLevel?: string;

  @ApiPropertyOptional({ example: true, description: 'Only show classes with available spots' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyAvailable?: boolean;
}
