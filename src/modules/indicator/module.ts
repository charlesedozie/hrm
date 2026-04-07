import { Module } from '@nestjs/common';
import { MasterIndicatorService } from './services/service';
import { MasterIndicatorController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MasterIndicatorService],
  controllers: [MasterIndicatorController],
})
export class MasterIndicatorModule {}
