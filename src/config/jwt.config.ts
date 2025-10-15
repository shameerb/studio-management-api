import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const JwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return {
      secret,
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRATION', '1h'),
        issuer: configService.get<string>('JWT_ISSUER', 'studio-management-api'),
        audience: configService.get<string>('JWT_AUDIENCE', 'cooperators'),
      },
    };
  },
  inject: [ConfigService],
};
