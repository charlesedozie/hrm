import { Module } from '@nestjs/common';
import { GrievanceService } from './services/service';
import { GrievanceController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GrievanceService],
  controllers: [GrievanceController],
})
export class GrievanceModule {}
