import { Module } from '@nestjs/common';
import { EarningService } from './services/service';
import { EarningController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EarningService],
  controllers: [EarningController],
})
export class EarningModule {}
