import { Module } from '@nestjs/common';
import { JobLevelService } from './services/service';
import { JobLevelController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [JobLevelService],
  controllers: [JobLevelController],
})
export class JobLevelModule {}
