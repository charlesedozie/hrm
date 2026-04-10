import { Module } from '@nestjs/common';
import { UploadController } from './controllers/controller';
import { UploadService } from './services/service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}