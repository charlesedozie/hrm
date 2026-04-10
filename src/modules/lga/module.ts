import { Module } from '@nestjs/common';
import { LgaService } from './services/service';
import { LgaController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LgaService],
  controllers: [LgaController],
})
export class LgaModule {}
