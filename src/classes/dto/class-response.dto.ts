export class ClassResponseDto {
  id: string;
  venueId: string;
  name: string;
  description?: string;
  instructorName?: string;
  startTime: Date;
  endTime: Date;
  spotsTotal: number;
  spotsAvailable: number;
  price: number;
  difficultyLevel?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ClassListResponseDto {
  data: ClassResponseDto[];
  total: number;
  page: number;
  limit: number;
}
