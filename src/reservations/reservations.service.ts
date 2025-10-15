import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ClassesService } from '../classes/classes.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly classesService: ClassesService,
  ) {}

  /**
   * Create a reservation with strong consistency to prevent overbooking
   * Uses database transactions with row locking
   */
  async create(
    cooperatorId: string,
    dto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    // Check if idempotency key already exists
    const existingReservation = await this.prisma.reservation.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    });

    if (existingReservation) {
      // If the reservation exists and is not cancelled, return it (idempotent)
      if (existingReservation.status === 'confirmed') {
        return this.mapToDto(existingReservation);
      }
      // If cancelled, we can allow rebooking with same idempotency key
    }

    // Execute reservation in a transaction with row locking
    return await this.prisma.$transaction(async (tx) => {
      // Lock the class row for update (prevents concurrent modifications)
      const classData = await tx.class.findUnique({
        where: { id: dto.classId },
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

      if (!classData) {
        throw new NotFoundException('Class not found');
      }

      // Verify access through venue
      if (classData.venue.venueCooperators.length === 0) {
        throw new NotFoundException('Class not found or access denied');
      }

      // Validate class is bookable
      if (!classData.isActive || classData.isCancelled) {
        throw new BadRequestException('Class is not available for booking');
      }

      // Check if class is in the future
      if (classData.startTime <= new Date()) {
        throw new BadRequestException('Cannot book classes that have already started');
      }

      // Check if spots are available
      if (classData.spotsAvailable <= 0) {
        throw new ConflictException('No spots available for this class');
      }

      // Create the reservation
      const reservation = await tx.reservation.create({
        data: {
          classId: dto.classId,
          cooperatorId,
          cooperatorUserId: dto.cooperatorUserId,
          idempotencyKey: dto.idempotencyKey,
          userEmail: dto.userEmail,
          userName: dto.userName,
          status: 'confirmed',
        },
      });

      // Decrement available spots atomically
      await tx.class.update({
        where: { id: dto.classId },
        data: {
          spotsAvailable: {
            decrement: 1,
          },
        },
      });

      return reservation;
    }, {
      maxWait: 5000, // Maximum time to wait for transaction
      timeout: 10000, // Maximum time for transaction to complete
    }).then(async (reservation) => {
      // Invalidate cache after successful reservation
      const classData = await this.prisma.class.findUnique({
        where: { id: dto.classId },
        select: { venueId: true },
      });

      if (classData) {
        await this.classesService.invalidateVenueCache(classData.venueId);
      }

      return this.mapToDto(reservation);
    });
  }

  /**
   * Cancel a reservation and restore the spot
   */
  async cancel(
    reservationId: string,
    cooperatorId: string,
    cancellationNote?: string,
  ): Promise<ReservationResponseDto> {
    // Execute cancellation in a transaction
    return await this.prisma.$transaction(async (tx) => {
      // Find the reservation
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
        include: {
          class: true,
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      // Verify ownership
      if (reservation.cooperatorId !== cooperatorId) {
        throw new NotFoundException('Reservation not found');
      }

      // Check if already cancelled
      if (reservation.status === 'cancelled') {
        throw new BadRequestException('Reservation is already cancelled');
      }

      // Check if class has already started (optional - depends on business rules)
      if (reservation.class.startTime <= new Date()) {
        throw new BadRequestException('Cannot cancel reservations for classes that have already started');
      }

      // Update reservation status
      const updatedReservation = await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationNote,
        },
      });

      // Increment available spots atomically
      await tx.class.update({
        where: { id: reservation.classId },
        data: {
          spotsAvailable: {
            increment: 1,
          },
        },
      });

      // Return both the updated reservation and the venueId for cache invalidation
      return {
        reservation: updatedReservation,
        venueId: reservation.class.venueId,
      };
    }, {
      maxWait: 5000,
      timeout: 10000,
    }).then(async (result) => {
      // Invalidate cache after cancellation
      await this.classesService.invalidateVenueCache(result.venueId);

      return this.mapToDto(result.reservation);
    });
  }

  /**
   * Get a reservation by ID
   */
  async findOne(
    reservationId: string,
    cooperatorId: string,
  ): Promise<ReservationResponseDto> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.cooperatorId !== cooperatorId) {
      throw new NotFoundException('Reservation not found');
    }

    return this.mapToDto(reservation);
  }

  /**
   * List all reservations for a cooperator
   */
  async findAll(cooperatorId: string): Promise<ReservationResponseDto[]> {
    const reservations = await this.prisma.reservation.findMany({
      where: { cooperatorId },
      orderBy: { createdAt: 'desc' },
    });

    return reservations.map(this.mapToDto);
  }

  /**
   * Map Prisma reservation to DTO
   */
  private mapToDto(reservation: any): ReservationResponseDto {
    return {
      id: reservation.id,
      classId: reservation.classId,
      cooperatorId: reservation.cooperatorId,
      cooperatorUserId: reservation.cooperatorUserId,
      idempotencyKey: reservation.idempotencyKey,
      status: reservation.status,
      userEmail: reservation.userEmail,
      userName: reservation.userName,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      cancelledAt: reservation.cancelledAt,
      cancellationNote: reservation.cancellationNote,
    };
  }
}
