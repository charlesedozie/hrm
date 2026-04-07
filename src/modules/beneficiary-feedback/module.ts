import { Module } from '@nestjs/common';
import { BeneficiaryFeedbackService } from './services/service';
import { BeneficiaryFeedbackController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BeneficiaryFeedbackService],
  controllers: [BeneficiaryFeedbackController],
})
export class BeneficiaryFeedbackModule {}
