import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VenueAccessGuard } from '../auth/guards/venue-access.guard';
import { CurrentCooperator, CooperatorPayload } from '../common/decorators/cooperator.decorator';
import { QueryVenuesDto } from './dto/query-venues.dto';
import { VenueResponseDto, VenueListResponseDto } from './dto/venue-response.dto';

@Controller('v1/venues')
@UseGuards(JwtAuthGuard)
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  async findAll(
    @CurrentCooperator() cooperator: CooperatorPayload,
    @Query() query: QueryVenuesDto,
  ): Promise<VenueListResponseDto> {
    return this.venuesService.findAll(cooperator.id, query);
  }

  @Get(':id')
  @UseGuards(VenueAccessGuard)
  async findOne(
    @Param('id') id: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<VenueResponseDto> {
    return this.venuesService.findOne(id, cooperator.id);
  }
}
