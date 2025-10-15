import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentCooperator, CooperatorPayload } from '../common/decorators/cooperator.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('v1/reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: 201,
    description: 'Reservation created successfully',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or class not available' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  @ApiResponse({ status: 404, description: 'Class not found or access denied' })
  @ApiResponse({ status: 409, description: 'Conflict - No spots available' })
  async create(
    @CurrentCooperator() cooperator: CooperatorPayload,
    @Body() dto: CreateReservationDto,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.create(cooperator.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations for the cooperator' })
  @ApiResponse({
    status: 200,
    description: 'List of reservations',
    type: [ReservationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async findAll(
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<ReservationResponseDto[]> {
    return this.reservationsService.findAll(cooperator.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reservation by ID' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation details',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.findOne(id, cooperator.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled successfully',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Reservation already cancelled or class started' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async cancel(
    @Param('id') id: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<ReservationResponseDto> {
    return this.reservationsService.cancel(id, cooperator.id);
  }
}
