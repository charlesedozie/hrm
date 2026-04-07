import {
Controller,
Post,
UploadedFile,
UseInterceptors,
HttpException,
HttpStatus, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../services/service';
import { memoryStorage } from 'multer';
import {
ApiTags,
ApiConsumes,
ApiBody,
ApiResponse,
} from '@nestjs/swagger';


import {
Delete,
Get,
Param,
Res,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';


import { UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)

export class UploadController {
constructor(private readonly uploadService: UploadService) {}

@Post()
@ApiConsumes('multipart/form-data')
@ApiBody({
schema: {
type: 'object',
properties: {
file: {
type: 'string',
format: 'binary',
},
},
},
})
@ApiResponse({
status: 201,
description: 'File uploaded successfully',
})
@UseInterceptors(
FileInterceptor('file', {
storage: memoryStorage(),
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}),
)
async uploadFile(@UploadedFile() file: Express.Multer.File) {
if (!file) {
throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
}

const newFileName = await this.uploadService.saveFile(file);

return {
success: true,
fileName: newFileName,
};
}


// ========================
// GET / VIEW FILE
// ========================
@Get(':fileName')
async getFile(
@Param('fileName') fileName: string,
@Res() res: Response,
) {
const filePath = this.uploadService.getFilePath(fileName);

if (filePath.includes('..')) {
throw new BadRequestException('Invalid file name');
}

const stream = createReadStream(filePath);
stream.pipe(res);
}

// ========================
// DELETE FILE
// ========================
@Delete(':fileName')
async deleteFile(@Param('fileName') fileName: string) {
return this.uploadService.deleteFile(fileName);
}
}