import { Module } from '@nestjs/common';
import { AssetCategoryService } from './services/service';
import { AssetCategoryController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AssetCategoryService],
  controllers: [AssetCategoryController],
})
export class AssetCategoryModule {}
