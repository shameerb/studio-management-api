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
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VenueAccessGuard } from '../auth/guards/venue-access.guard';
import { CurrentCooperator, CooperatorPayload } from '../common/decorators/cooperator.decorator';
import { QueryClassesDto } from './dto/query-classes.dto';
import { ClassResponseDto, ClassListResponseDto } from './dto/class-response.dto';

@ApiTags('classes')
@ApiBearerAuth()
@Controller('v1/venues/:venueId/classes')
@UseGuards(JwtAuthGuard, VenueAccessGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({ summary: 'Get live inventory of classes for a venue' })
  @ApiParam({ name: 'venueId', description: 'Venue ID' })
  @ApiResponse({
    status: 200,
    description: 'List of classes with availability',
    type: ClassListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to this venue' })
  @ApiResponse({ status: 404, description: 'Venue not found' })
  async findByVenue(
    @Param('venueId') venueId: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
    @Query() query: QueryClassesDto,
  ): Promise<ClassListResponseDto> {
    return this.classesService.findByVenue(venueId, cooperator.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class details' })
  @ApiParam({ name: 'venueId', description: 'Venue ID' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({
    status: 200,
    description: 'Class details',
    type: ClassResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to this venue' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<ClassResponseDto> {
    return this.classesService.findOne(id, cooperator.id);
  }
}
