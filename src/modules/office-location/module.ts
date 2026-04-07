import { Module } from '@nestjs/common';
import { OfficeLocationService } from './services/service';
import { OfficeLocationController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OfficeLocationService],
  controllers: [OfficeLocationController],
})
export class OfficeLocationModule {}
