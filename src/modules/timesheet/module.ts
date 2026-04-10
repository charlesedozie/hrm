import { Module } from '@nestjs/common';
import { TimesheetService } from './services/service';
import { TimesheetController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TimesheetService],
  controllers: [TimesheetController],
})
export class TimesheetModule {}
