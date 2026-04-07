import { Module } from '@nestjs/common';
import { BeneficiaryRequestService } from './services/service';
import { BeneficiaryRequestController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BeneficiaryRequestService],
  controllers: [BeneficiaryRequestController],
})
export class BeneficiaryRequestModule {}
