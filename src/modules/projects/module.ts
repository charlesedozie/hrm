import { Module } from '@nestjs/common';
import { ProjectService } from './services/service';
import { ProjectController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
