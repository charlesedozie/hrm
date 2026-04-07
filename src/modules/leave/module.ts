import { Module } from '@nestjs/common';
import { LeaveTypeService } from './services/service';
import { LeaveTypeController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LeaveTypeService],
  controllers: [LeaveTypeController],
})
export class LeaveModule {}
