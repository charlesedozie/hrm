import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class UploadService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');
private readonly allowedExtensions = [
  // Images
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.svg',

  // Documents
  '.pdf', '.doc', '.docx', '.rtf', '.txt', '.odt',

  // Spreadsheets
  '.xls', '.xlsx', '.xlsm', '.csv', '.ods',

  // Presentations
  '.ppt', '.pptx', '.odp',

  // CAD / Engineering
  '.dwg', '.dxf', '.dwt', '.step', '.stp', '.iges', '.igs',

  // Design / Graphics
  '.cdr', '.ai', '.psd', '.indd', '.eps',

  // Archives
  '.zip', '.rar', '.7z', '.tar', '.gz',

  // Data / Structured files
  '.json', '.xml', '.yaml', '.yml',

  // Email
  '.msg', '.eml',

  // Project / Planning
  '.mpp',

  // Web files
  '.html', '.htm', '.css', '.js',

  // Media
  '.mp3', '.wav', '.mp4', '.mov', '.avi', '.wmv'
];

private readonly allowedMimeTypes = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp',
  'image/svg+xml',

  // Documents
  'application/pdf',
  'application/msword',
  'application/rtf',
  'text/plain',
  'application/vnd.oasis.opendocument.text',

  // Word (DOCX)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // Excel
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'text/csv',
  'application/vnd.oasis.opendocument.spreadsheet',

  // PowerPoint
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.presentation',

  // CAD / Engineering
  'application/acad',
  'application/x-autocad',
  'application/dxf',
  'model/step',
  'model/iges',

  // Graphics / Design
  'application/postscript',
  'image/vnd.adobe.photoshop',

  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/x-tar',
  'application/gzip',

  // Data
  'application/json',
  'application/xml',
  'text/xml',
  'application/x-yaml',

  // Email
  'application/vnd.ms-outlook',
  'message/rfc822',

  // Media
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',

  // Web
  'text/html',
  'text/css',
  'application/javascript'
];

private sanitizeFileName(originalName: string): string {
  const ext = extname(originalName).toLowerCase();

  // Remove extension from base name
  const baseName = originalName.replace(ext, '');

  // Allow only letters, numbers, dash, underscore
  const safeBase = baseName
    .replace(/[^a-zA-Z0-9-_]/g, '')   // remove unsafe chars
    .substring(0, 50);                // limit length

  return safeBase + ext;
}
  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  
  async saveFile(file: Express.Multer.File): Promise<{
    fileName: string;
    originalName: string;
    size: number;
    mimeType: string;
  }> {
  const fileExtension = extname(file.originalname).toLowerCase();

   // Sanitize original name (for metadata only)
  const safeOriginalName = this.sanitizeFileName(file.originalname);
  
    const newFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, newFileName);

     if (!file) {
    throw new BadRequestException('No file uploaded');
  }


  // 🚫 Block disallowed extensions
  if (!this.allowedExtensions.includes(fileExtension)) {
    throw new BadRequestException('File type not allowed');
  }

  // 🚫 Block invalid MIME types
  if (!this.allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException('File type not allowed');
  }

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      fileName: newFileName,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }


  
  getFilePath(fileName: string): string {
    const filePath = path.join(this.uploadPath, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return filePath;
  }

  async deleteFile(fileName: string) {
    const filePath = this.getFilePath(fileName);

    await fs.promises.unlink(filePath);

    return { message: 'File deleted successfully' };
  }
}