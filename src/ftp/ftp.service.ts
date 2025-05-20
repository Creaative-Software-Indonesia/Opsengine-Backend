// // src/ftp/ftp.service.ts

// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { Client } from 'basic-ftp';
// import { Readable } from 'stream';
// import { v4 as uuidv4 } from 'uuid';

// @Injectable()
// export class FtpService {
//     private readonly host = process.env.FTP_HOST;
//     private readonly port = 21;
//     private readonly user = process.env.FTP_USER;
//     private readonly password = process.env.FTP_PASSWORD;
//     private readonly remoteFolder = '/ftp/activity';

//     async uploadFile(file: Express.Multer.File): Promise<string> {
//         const client = new Client();
//         try {
//             const fileExtension = file.originalname.split('.').pop();
//             const newFileName = `${uuidv4()}.${fileExtension}`;
//             const stream = Readable.from(file.buffer);

//             await client.access({
//                 host: this.host,
//                 port: this.port,
//                 user: this.user,
//                 password: this.password,
//                 secure: false,
//             });

//             await client.ensureDir(this.remoteFolder);
//             await client.uploadFrom(stream, `${this.remoteFolder}/${newFileName}`);

//             return newFileName;
//         } catch (error) {
//             console.error(error);
//             throw new InternalServerErrorException('FTP upload failed', error.message);
//         } finally {
//             client.close();
//         }
//     }
// }

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class FtpService {
    private readonly logger = new Logger(FtpService.name);
    private readonly host = process.env.FTP_HOST;
    private readonly port = parseInt(process.env.FTP_PORT || '21', 10);
    private readonly user = process.env.FTP_USER;
    private readonly password = process.env.FTP_PASSWORD;
    private readonly remoteFolder = '/ftp/activity';
    private readonly allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const client = new Client();
        client.ftp.verbose = true; // Enable for debugging

        try {
            // Validate file object
            if (!file || !file.buffer || !file.originalname) {
                throw new Error('Invalid file object');
            }

            // Validate file size
            if (file.size > this.maxFileSize) {
                throw new Error(`File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit`);
            }

            // Extract and validate file extension
            const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
            if (!fileExtension) {
                throw new Error('File has no extension');
            }
            if (!this.allowedExtensions.includes(fileExtension)) {
                throw new Error(`File type .${fileExtension} is not allowed. Allowed types: ${this.allowedExtensions.join(', ')}`);
            }

            // Generate unique filename
            const newFileName = `${uuidv4()}.${fileExtension}`;
            const stream = Readable.from(file.buffer);

            // Connect to FTP
            await client.access({
                host: this.host,
                port: this.port,
                user: this.user,
                password: this.password,
                secure: false // Set to true for FTPS
            });

            // Ensure directory exists
            await client.ensureDir(this.remoteFolder);

            // Upload file
            await client.uploadFrom(stream, `${this.remoteFolder}/${newFileName}`);

            this.logger.log(`File uploaded successfully: ${newFileName}`);
            return newFileName;
        } catch (error) {
            console.log(error);
            this.logger.error(`FTP upload failed: ${error.message}`, error.stack);
            throw new InternalServerErrorException(error.message);
        } finally {
            try {
                if (client && !client.closed) {
                    client.close();
                }
            } catch (closeError) {
                this.logger.warn('Failed to close FTP connection', closeError);
            }
        }
    }
}