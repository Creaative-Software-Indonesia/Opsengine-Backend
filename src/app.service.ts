import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    const currentDate = new Date().toISOString();
    return {
      code:200,
      message:"Selamat Datang",
      data: {
        date: currentDate,
        name: 'Machine Maintenance API',
        createAt: 'Asep Trisna Setiawan, Lampung-Bandung, Indonesia (2025)'
      }
    };
  }
}