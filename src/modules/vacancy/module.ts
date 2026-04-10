import { Module } from '@nestjs/common';
import { VacancyService } from './services/service';
import { VacancyController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VacancyService],
  controllers: [VacancyController],
})
export class VacancyModule {}
