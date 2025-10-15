import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VenueAccessGuard } from '../auth/guards/venue-access.guard';
import { CurrentCooperator, CooperatorPayload } from '../common/decorators/cooperator.decorator';
import { QueryClassesDto } from './dto/query-classes.dto';
import { ClassResponseDto, ClassListResponseDto } from './dto/class-response.dto';

@Controller('v1/venues/:venueId/classes')
@UseGuards(JwtAuthGuard, VenueAccessGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async findByVenue(
    @Param('venueId') venueId: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
    @Query() query: QueryClassesDto,
  ): Promise<ClassListResponseDto> {
    return this.classesService.findByVenue(venueId, cooperator.id, query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentCooperator() cooperator: CooperatorPayload,
  ): Promise<ClassResponseDto> {
    return this.classesService.findOne(id, cooperator.id);
  }
}
