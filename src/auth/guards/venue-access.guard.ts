import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Guard to check if the authenticated cooperator has access to a specific venue
 * Expects venueId to be in request params
 */
@Injectable()
export class VenueAccessGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cooperator = request.cooperator;
    const venueId = request.params.venueId || request.params.id;

    if (!cooperator) {
      throw new ForbiddenException('Cooperator information is missing');
    }

    if (!venueId) {
      // If no specific venue is being accessed, allow the request
      // (e.g., for listing all accessible venues)
      return true;
    }

    const hasAccess = await this.authService.hasVenueAccess(
      cooperator.id,
      venueId,
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have access to this venue',
      );
    }

    return true;
  }
}
