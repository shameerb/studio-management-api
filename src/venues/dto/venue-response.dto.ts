export class VenueResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  description?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class VenueListResponseDto {
  data: VenueResponseDto[];
  total: number;
  page: number;
  limit: number;
}
