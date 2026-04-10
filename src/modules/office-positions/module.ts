import { Module } from '@nestjs/common';
import { OfficePositionService } from './services/service';
import { OfficePositionController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OfficePositionService],
  controllers: [OfficePositionController],
})
export class OfficePositionModule {}