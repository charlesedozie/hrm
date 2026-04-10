import { Module } from '@nestjs/common';
import { NigeriaStateService } from './services/service';
import { NigeriaStateController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NigeriaStateService],
  controllers: [NigeriaStateController],
})
export class NigeriaStateModule {}
