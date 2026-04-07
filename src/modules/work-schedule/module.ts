import { Module } from '@nestjs/common';
import { WorkScheduleService } from './services/service';
import { WorkScheduleController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WorkScheduleService],
  controllers: [WorkScheduleController],
})
export class WorkScheduleModule {}
