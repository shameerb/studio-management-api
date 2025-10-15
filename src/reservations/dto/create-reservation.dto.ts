import { IsString, IsUUID, IsEmail, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsUUID()
  classId: string;

  @IsString()
  cooperatorUserId: string;

  @IsString()
  idempotencyKey: string;

  @IsOptional()
  @IsEmail()
  userEmail?: string;

  @IsOptional()
  @IsString()
  userName?: string;
}
