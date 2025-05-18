// src/ftp/ftp.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FtpService {
    private readonly host = process.env.FTP_HOST;
    private readonly port = 21;
    private readonly user = process.env.FTP_USER;
    private readonly password = process.env.FTP_PASSWORD;
    private readonly remoteFolder = '/ftp/activity';

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const client = new Client();
        try {
            const fileExtension = file.originalname.split('.').pop();
            const newFileName = `${uuidv4()}.${fileExtension}`;
            const stream = Readable.from(file.buffer);

            await client.access({
                host: this.host,
                port: this.port,
                user: this.user,
                password: this.password,
                secure: false,
            });

            await client.ensureDir(this.remoteFolder);
            await client.uploadFrom(stream, `${this.remoteFolder}/${newFileName}`);

            return newFileName;
        } catch (error) {
            throw new InternalServerErrorException('FTP upload failed', error.message);
        } finally {
            client.close();
        }
    }
}
