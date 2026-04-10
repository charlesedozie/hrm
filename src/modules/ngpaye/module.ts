import { Module } from '@nestjs/common';
import { NgpayeBandService } from './services/service';
import { NgpayeBandController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NgpayeBandService],
  controllers: [NgpayeBandController],
})
export class NgpayeBandModule {}
