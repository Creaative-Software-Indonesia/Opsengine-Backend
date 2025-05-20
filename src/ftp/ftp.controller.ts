// // src/ftp/ftp.controller.ts

// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { FtpService } from './ftp.service';
// import {
//   ApiBearerAuth,
//   ApiBody,
//   ApiConsumes,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

// @ApiTags('FTP')
// @Controller('ftp')
// export class FtpController {
//   constructor(private readonly ftpService: FtpService) {}

//   /**
//    *
//    * @param file
//    * @returns
//    */
//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard)
//   @Post('upload')
//   @ApiOperation({ summary: 'Upload gambar ke FTP' })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         file: {
//           type: 'string',
//           format: 'binary',
//         },
//       },
//     },
//   })
//   @UseInterceptors(
//     FileInterceptor('file', {
//       limits: {
//         fileSize: 5 * 1024 * 1024,
//       },
//     }),
//   )
//   async uploadImage(@UploadedFile() file: Express.Multer.File) {
//     const filename = await this.ftpService.uploadFile(file);
//     const url = `https://image-view.sta.my.id/activity/${filename}`;
//     return {
//       message: 'File uploaded successfully',
//       filename: url,
//     };
//   }
// }

import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FtpService } from './ftp.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import * as path from 'path';
import { diskStorage } from 'multer';

@ApiTags('FTP')
@Controller('ftp')
export class FtpController {
  private readonly logger = new Logger(FtpController.name);

  constructor(private readonly ftpService: FtpService) {}

  /**
   * Upload image to FTP server
   * @param file The file to upload
   * @returns Upload result with file URL
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @ApiOperation({ 
    summary: 'Upload gambar ke FTP',
    description: 'Upload gambar dengan format JPG/JPEG/PNG maksimal 5MB'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPG/JPEG/PNG) max 5MB'
        },
      },
      required: ['file']
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File uploaded successfully' },
        filename: { type: 'string', example: 'https://image-view.sta.my.id/activity/uuid.jpg' },
        originalName: { type: 'string', example: 'example.jpg' },
        size: { type: 'number', example: 123456 },
        mimetype: { type: 'string', example: 'image/jpeg' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
          return callback(
            new BadRequestException('Only JPG/JPEG/PNG files are allowed'),
            false
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './tmp/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      this.logger.log(`Uploading file: ${file.originalname} (${file.size} bytes)`);

      const filename = await this.ftpService.uploadFile(file);
      const url = `https://image-view.sta.my.id/activity/${filename}`;

      return {
        success: true,
        message: 'File uploaded successfully',
        filename: url,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}