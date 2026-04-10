import { Module } from '@nestjs/common';
import { UserSettingsService } from './services/service';
import { UserSettingsController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [UserSettingsService],
  controllers: [UserSettingsController],
})
export class UserSettingsModule {}
