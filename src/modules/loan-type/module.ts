import { Module } from '@nestjs/common';
import { LoanTypeService } from './services/service';
import { LoanTypeController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LoanTypeService],
  controllers: [LoanTypeController],
})
export class LoanTypeModule {}
