import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates an API key and returns the associated cooperator
   * @param apiKey - The plain text API key from the request header
   * @returns The cooperator object if valid
   * @throws UnauthorizedException if the key is invalid or inactive
   */
  async validateApiKey(apiKey: string) {
    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Find all active API keys (we need to check the hash)
    const apiKeys = await this.prisma.apiKey.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        cooperator: true,
      },
    });

    // Check each key hash to find a match
    for (const key of apiKeys) {
      const isMatch = await bcrypt.compare(apiKey, key.keyHash);

      if (isMatch) {
        // Check if cooperator is active
        if (!key.cooperator.isActive) {
          throw new UnauthorizedException('Cooperator account is inactive');
        }

        // Update last used timestamp
        await this.prisma.apiKey.update({
          where: { id: key.id },
          data: { lastUsedAt: new Date() },
        });

        return key.cooperator;
      }
    }

    throw new UnauthorizedException('Invalid API key');
  }

  /**
   * Check if a cooperator has access to a specific venue
   * @param cooperatorId - The cooperator's ID
   * @param venueId - The venue's ID
   * @returns true if access is granted
   */
  async hasVenueAccess(cooperatorId: string, venueId: string): Promise<boolean> {
    const venueCooperator = await this.prisma.venueCooperator.findFirst({
      where: {
        cooperatorId,
        venueId,
        isActive: true,
        venue: {
          isActive: true,
          apiEnabled: true,
        },
      },
    });

    return !!venueCooperator;
  }

  /**
   * Get all venue IDs that a cooperator has access to
   * @param cooperatorId - The cooperator's ID
   * @returns Array of venue IDs
   */
  async getAccessibleVenueIds(cooperatorId: string): Promise<string[]> {
    const venueCooperators = await this.prisma.venueCooperator.findMany({
      where: {
        cooperatorId,
        isActive: true,
        venue: {
          isActive: true,
          apiEnabled: true,
        },
      },
      select: {
        venueId: true,
      },
    });

    return venueCooperators.map((vc) => vc.venueId);
  }

  /**
   * Validate client credentials and generate JWT token (OAuth 2.0 Client Credentials flow)
   * @param clientId - The cooperator's API key ID
   * @param clientSecret - The plain text API key
   * @returns JWT access token with expiration info
   * @throws UnauthorizedException if credentials are invalid
   */
  async generateToken(clientId: string, clientSecret: string) {
    // Find the API key by ID
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id: clientId },
      include: {
        cooperator: true,
      },
    });

    if (!apiKey || !apiKey.isActive) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    // Check if API key is expired
    if (apiKey.expiresAt && apiKey.expiresAt <= new Date()) {
      throw new UnauthorizedException('Client credentials expired');
    }

    // Verify the client secret (API key) matches
    const isMatch = await bcrypt.compare(clientSecret, apiKey.keyHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    // Check if cooperator is active
    if (!apiKey.cooperator.isActive) {
      throw new UnauthorizedException('Cooperator account is inactive');
    }

    // Update last used timestamp
    await this.prisma.apiKey.update({
      where: { id: clientId },
      data: { lastUsedAt: new Date() },
    });

    // Generate JWT token
    const payload = {
      sub: apiKey.cooperator.id,
      name: apiKey.cooperator.name,
      email: apiKey.cooperator.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour in seconds
    };
  }
}
