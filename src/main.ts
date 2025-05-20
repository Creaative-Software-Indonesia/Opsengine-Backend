import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '6mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '6mb' }));

  // Daftar domain yang diizinkan (dengan regex untuk wildcard)
  const allowedOrigins = [
    /^.*$/, // Mengizinkan semua domain
    /.*\.sta\.my\.id$/,
    /.*\.lskk\.co\.id$/,
    /.*\.pptik\.id$/,
    /localhost(:\d+)?$/, // Mendukung localhost dengan port opsional
  ];

  // Enable CORS dengan pengaturan domain yang diizinkan
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((pattern) => pattern.test(origin))) {
        callback(null, true); // Mengizinkan permintaan jika asal termasuk dalam daftar
      } else {
        Logger.warn(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true, // Jika perlu mengirimkan cookie atau token autentikasi
  });

  // Mengatur prefix global untuk API
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  app.setGlobalPrefix('/v1');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Machine Maintenance API')
    .setDescription('API for machine maintenance management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Application is running on: http://localhost:${process.env.PORT}/v1`, 'Bootstrap');
  Logger.log('Allowed Origins:', 'Bootstrap');
  allowedOrigins.forEach((pattern) => Logger.log(pattern.toString(), 'Bootstrap'));
  Logger.log(`Created by Asep Trisna Setiawan, Bandung Indonesia, 14 April 2025`, 'Bootstrap');
}
bootstrap();
