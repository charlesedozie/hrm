import { Module } from '@nestjs/common';
import { InterventionBatchService } from './services/service';
import { InterventionBatchController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InterventionBatchService],
  controllers: [InterventionBatchController],
})
export class InterventionBatchModule {}
