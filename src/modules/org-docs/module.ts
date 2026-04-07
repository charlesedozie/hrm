import { Module } from '@nestjs/common';
import { OrgDocsService } from './services/service';
import { OrgDocsController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OrgDocsService],
  controllers: [OrgDocsController],
})
export class OrgDocsModule {}
