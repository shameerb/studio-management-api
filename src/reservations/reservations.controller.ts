import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentCooperator, CooperatorPayload } from '../common/decorators/cooperator.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@Controller('v1/reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(
    @CurrentCooperator() cooperator: CooperatorPayload,
    @Body() dto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.create(cooperator.id, dto);
  }

  @Get()
  async findAll(
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<ReservationResponseDto[]> {
    return this.reservationsService.findAll(cooperator.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.findOne(id, cooperator.id);
  }

  @Delete(':id')
  async cancel(
    @Param('id') id: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.cancel(id, cooperator.id);
  }
}
