import { Module } from '@nestjs/common';
import { BeneficiaryService } from './services/service';
import { BeneficiaryController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ApprovalModule } from '@/modules/approval/module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [ApprovalModule, PrismaModule, UsersModule],
  providers: [BeneficiaryService],
  controllers: [BeneficiaryController],
})
export class BeneficiaryModule {}
