import { Module } from '@nestjs/common';
import { HolidayCalendarService } from './services/service';
import { HolidayCalendarController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HolidayCalendarService],
  controllers: [HolidayCalendarController],
})
export class HolidayCalendarModule {}
