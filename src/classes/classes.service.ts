import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { QueryClassesDto } from './dto/query-classes.dto';
import { ClassResponseDto, ClassListResponseDto } from './dto/class-response.dto';

@Injectable()
export class ClassesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findByVenue(
    venueId: string,
    cooperatorId: string,
    query: QueryClassesDto,
  ): Promise<ClassListResponseDto> {
    const hasAccess = await this.authService.hasVenueAccess(cooperatorId, venueId);

    if (!hasAccess) {
      throw new NotFoundException('Venue not found or access denied');
    }

    const { page = 1, limit = 20, startDate, endDate, difficultyLevel, onlyAvailable } = query;
    const skip = (page - 1) * limit;

    // Create cache key
    const cacheKey = `classes:venue:${venueId}:${JSON.stringify(query)}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<ClassListResponseDto>(cacheKey);
    if (cached) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    console.log(`Cache miss for key: ${cacheKey}`);

    // Build filter conditions
    const where: any = {
      venueId,
      isActive: true,
      isCancelled: false,
    };

    if (startDate) {
      where.startTime = { gte: new Date(startDate) };
    }

    if (endDate) {
      where.startTime = {
        ...where.startTime,
        lte: new Date(endDate),
      };
    }

    if (difficultyLevel) {
      where.difficultyLevel = difficultyLevel;
    }

    if (onlyAvailable) {
      where.spotsAvailable = { gt: 0 };
    }

    // Get classes with pagination
    const [classes, total] = await Promise.all([
      this.prisma.class.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'asc' },
      }),
      this.prisma.class.count({ where }),
    ]);

    const result = {
      data: classes.map(this.mapToDto),
      total,
      page,
      limit,
    };

    // Cache the result with 5 minute TTL (300 seconds)
    await this.cacheManager.set(cacheKey, result, 300000);

    return result;
  }

  /**
   * Get a single class by ID
   */
  async findOne(classId: string, cooperatorId: string): Promise<ClassResponseDto> {
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        venue: {
          include: {
            venueCooperators: {
              where: { cooperatorId, isActive: true },
            },
          },
        },
      },
    });

    if (!classData || !classData.isActive || classData.isCancelled) {
      throw new NotFoundException('Class not found');
    }

    // Verify access through venue
    if (classData.venue.venueCooperators.length === 0) {
      throw new NotFoundException('Class not found or access denied');
    }

    return this.mapToDto(classData);
  }

  /**
   * Invalidate cache for a specific venue
   * Called when reservations are made/cancelled
   */
  async invalidateVenueCache(venueId: string): Promise<void> {
    // In a production system, you'd want to track cache keys or use a tag-based system
    // For now, we'll just log the invalidation
    console.log(`Invalidating cache for venue: ${venueId}`);
    // With Redis, you could use SCAN to find and delete all matching keys
    // For this example, cache will auto-expire after TTL
  }

  /**
   * Map Prisma class to DTO
   */
  private mapToDto(classData: any): ClassResponseDto {
    return {
      id: classData.id,
      venueId: classData.venueId,
      name: classData.name,
      description: classData.description,
      instructorName: classData.instructorName,
      startTime: classData.startTime,
      endTime: classData.endTime,
      spotsTotal: classData.spotsTotal,
      spotsAvailable: classData.spotsAvailable,
      price: classData.price.toNumber(),
      difficultyLevel: classData.difficultyLevel,
      createdAt: classData.createdAt,
      updatedAt: classData.updatedAt,
    };
  }
}
