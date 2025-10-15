import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { VenuesService } from './venues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VenueAccessGuard } from '../auth/guards/venue-access.guard';
import { CurrentCooperator, CooperatorPayload } from '../common/decorators/cooperator.decorator';
import { QueryVenuesDto } from './dto/query-venues.dto';
import { VenueResponseDto, VenueListResponseDto } from './dto/venue-response.dto';

@ApiTags('venues')
@ApiBearerAuth()
@Controller('v1/venues')
@UseGuards(JwtAuthGuard)
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accessible venues' })
  @ApiResponse({
    status: 200,
    description: 'List of venues accessible by the cooperator',
    type: VenueListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async findAll(
    @CurrentCooperator() cooperator: CooperatorPayload,
    @Query() query: QueryVenuesDto,
  ): Promise<VenueListResponseDto> {
    return this.venuesService.findAll(cooperator.id, query);
  }

  @Get(':id')
  @UseGuards(VenueAccessGuard)
  @ApiOperation({ summary: 'Get venue details' })
  @ApiParam({ name: 'id', description: 'Venue ID' })
  @ApiResponse({
    status: 200,
    description: 'Venue details',
    type: VenueResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to this venue' })
  @ApiResponse({ status: 404, description: 'Venue not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<VenueResponseDto> {
    return this.venuesService.findOne(id, cooperator.id);
  }
}
