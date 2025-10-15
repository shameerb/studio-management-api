import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { QueryVenuesDto } from './dto/query-venues.dto';
import { VenueResponseDto, VenueListResponseDto } from './dto/venue-response.dto';

@Injectable()
export class VenuesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Get all venues accessible by a cooperator
   */
  async findAll(
    cooperatorId: string,
    query: QueryVenuesDto,
  ): Promise<VenueListResponseDto> {
    const { page = 1, limit = 20, city, state } = query;
    const skip = (page - 1) * limit;

    // Get accessible venue IDs
    const accessibleVenueIds = await this.authService.getAccessibleVenueIds(
      cooperatorId,
    );

    if (accessibleVenueIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
      };
    }

    // Build filter conditions
    const where: any = {
      id: { in: accessibleVenueIds },
      isActive: true,
      apiEnabled: true,
    };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (state) {
      where.state = { contains: state, mode: 'insensitive' };
    }

    // Get venues with pagination
    const [venues, total] = await Promise.all([
      this.prisma.venue.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.venue.count({ where }),
    ]);

    return {
      data: venues.map(this.mapToDto),
      total,
      page,
      limit,
    };
  }

  /**
   * Get a single venue by ID
   */
  async findOne(venueId: string, cooperatorId: string): Promise<VenueResponseDto> {
    // Check access
    const hasAccess = await this.authService.hasVenueAccess(cooperatorId, venueId);

    if (!hasAccess) {
      throw new NotFoundException('Venue not found or access denied');
    }

    const venue = await this.prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue || !venue.isActive || !venue.apiEnabled) {
      throw new NotFoundException('Venue not found');
    }

    return this.mapToDto(venue);
  }

  /**
   * Map Prisma venue to DTO
   */
  private mapToDto(venue: any): VenueResponseDto {
    return {
      id: venue.id,
      name: venue.name,
      email: venue.email,
      phone: venue.phone,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      zipCode: venue.zipCode,
      country: venue.country,
      description: venue.description,
      website: venue.website,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt,
    };
  }
}
