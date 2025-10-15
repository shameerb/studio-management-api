export class ReservationResponseDto {
  id: string;
  classId: string;
  cooperatorId: string;
  cooperatorUserId: string;
  idempotencyKey: string;
  status: string;
  userEmail?: string;
  userName?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancellationNote?: string;
}
