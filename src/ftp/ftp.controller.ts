// src/ftp/ftp.controller.ts

import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FtpService } from './ftp.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@ApiTags('FTP')
@Controller('ftp')
export class FtpController {
    constructor(private readonly ftpService: FtpService) { }

    /**
     * 
     * @param file 
     * @returns 
     */
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @ApiOperation({ summary: 'Upload gambar ke FTP' })
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
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const filename = await this.ftpService.uploadFile(file);
        const url=`https://image-view.sta.my.id/activity/${filename}`;
        return {
            message: 'File uploaded successfully',
            filename:url,
        };
    }
}
