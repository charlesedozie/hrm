import { Module } from '@nestjs/common';
import { CountryService } from './services/service';
import { CountryController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
