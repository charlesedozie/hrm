import { Module } from '@nestjs/common';
import { ApprovalService } from './services/service';
import { ApprovalController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(), // ✅ enables CRON jobs in this module
  ],
  controllers: [ApprovalController],
  providers: [ApprovalService],
  exports: [ApprovalService],
})
export class ApprovalModule {}