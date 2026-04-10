import { Module } from '@nestjs/common';
import { GenderService } from './services/service';
import { GenderController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GenderService],
  controllers: [GenderController],
})
export class GenderModule {}
