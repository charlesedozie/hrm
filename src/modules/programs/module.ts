import { Module } from '@nestjs/common';
import { ProgramService } from './services/service';
import { ProgramController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProgramService],
  controllers: [ProgramController],
})
export class ProgramModule {}
