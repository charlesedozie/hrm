import { Module } from '@nestjs/common';
import { InterventionCategoryService } from './services/service';
import { InterventionCategoryController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InterventionCategoryService],
  controllers: [InterventionCategoryController],
})
export class InterventionCategoryModule {}
