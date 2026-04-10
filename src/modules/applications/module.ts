import { Module } from '@nestjs/common';
import { ApplicationformService } from './services/service';
import { ApplicationformController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ApplicationformService],
  controllers: [ApplicationformController],
})
export class ApplicationformModule {}
