import { Module } from '@nestjs/common';
import { InterventionService } from './services/service';
import { InterventionController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InterventionService],
  controllers: [InterventionController],
})
export class InterventionModule {}
