import { Module } from '@nestjs/common';
import { PayrollPeriodService } from './services/service';
import { PayrollPeriodController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PayrollPeriodService],
  exports: [PayrollPeriodService],
  controllers: [PayrollPeriodController],
})
export class PayrollPeriodModule {}
