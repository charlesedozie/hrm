import { Module } from '@nestjs/common';
import { PayrollCalendarService } from './services/service';
import { PayrollCalendarController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { PayrollPeriodModule } from '@/modules/payperiod/module';

@Module({
  imports: [PrismaModule, PayrollPeriodModule],
  providers: [PayrollCalendarService],
  controllers: [PayrollCalendarController],
})
export class PayrollCalendarModule {}
