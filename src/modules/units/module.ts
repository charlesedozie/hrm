import { Module } from '@nestjs/common';
import { UnitService } from './services/service';
import { UnitController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UnitService],
  controllers: [UnitController],
})
export class UnitModule {}
