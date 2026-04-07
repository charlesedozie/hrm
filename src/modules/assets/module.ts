import { Module } from '@nestjs/common';
import { AssetService } from './services/service';
import { AssetController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AssetService],
  controllers: [AssetController],
})
export class AssetModule {}
