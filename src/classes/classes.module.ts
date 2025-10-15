import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, CacheModule.register()],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
