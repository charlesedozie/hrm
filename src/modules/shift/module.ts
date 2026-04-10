import { Module } from '@nestjs/common';
import { ShiftService } from './services/service';
import { ShiftController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShiftService],
  controllers: [ShiftController],
})
export class ShiftModule {}
