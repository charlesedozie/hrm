import { Module } from '@nestjs/common';
import { MessageService } from './services/service';
import { MessageController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
