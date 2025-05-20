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
  InternalServerErrorException,
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

const allowedExtensions = ['.jpg', '.jpeg', '.png'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

@ApiTags('FTP')
@Controller('ftp')
export class FtpController {
  private readonly logger = new Logger(FtpController.name);

  constructor(private readonly ftpService: FtpService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @ApiOperation({ summary: 'Upload image to FTP server' })
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
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: maxFileSize },
    fileFilter: (req, file, callback) => {
      try {
        if (!file || !file.originalname) {
          return callback(new BadRequestException('Invalid file object'), false);
        }

        const ext = path.extname(file.originalname || '').toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          return callback(
            new BadRequestException(
              `Only ${allowedExtensions.join(', ')} files are allowed`
            ),
            false
          );
        }
        callback(null, true);
      } catch (error) {
        callback(error, false);
      }
    },
    storage: diskStorage({
      destination: './tmp/uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
      },
    }),
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      // Additional validation in case interceptor doesn't catch it
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      this.logger.log(`Uploading file: ${file.originalname} (${file.size} bytes)`);

      // Validate file buffer exists
      if (!file.buffer) {
        throw new BadRequestException('File buffer is empty');
      }

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
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('File upload failed. Please try again.');
    }
  }
}