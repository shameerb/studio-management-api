import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string; // cooperator ID
  name: string;
  email: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: configService.get<string>('JWT_ISSUER', 'studio-management-api'),
      audience: configService.get<string>('JWT_AUDIENCE', 'cooperators'),
    });
  }

  async validate(payload: JwtPayload) {
    // Verify the cooperator still exists and is active
    const cooperator = await this.prisma.cooperator.findUnique({
      where: { id: payload.sub },
    });

    if (!cooperator || !cooperator.isActive) {
      throw new UnauthorizedException('Cooperator not found or inactive');
    }

    // Return cooperator info to be attached to request
    return {
      id: cooperator.id,
      name: cooperator.name,
      email: cooperator.email,
    };
  }
}
