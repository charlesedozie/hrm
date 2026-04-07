import { Module } from '@nestjs/common';
import { OfficeRoleService } from './services/service';
import { OfficeRoleController } from './controllers/controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OfficeRoleService],
  controllers: [OfficeRoleController],
})
export class OfficeRoleModule {}
