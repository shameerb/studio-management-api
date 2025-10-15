import { IsOptional, IsInt, Min, Max, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryClassesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  difficultyLevel?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyAvailable?: boolean;
}
