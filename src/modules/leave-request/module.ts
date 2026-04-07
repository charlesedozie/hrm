import { Module } from '@nestjs/common';
import { LeaveRequestService } from './services/service';
import { LeaveRequestController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LeaveRequestService],
  controllers: [LeaveRequestController],
})
export class LeaveRequestModule {}
