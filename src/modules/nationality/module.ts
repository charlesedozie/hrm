import { Module } from '@nestjs/common';
import { NationalityService } from './services/service';
import { NationalityController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NationalityService],
  controllers: [NationalityController],
})
export class NationalityModule {}
