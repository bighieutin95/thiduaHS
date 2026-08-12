import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
const server = express();

export const createNestApp = async (expressInstance: any) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: (origin: any, callback: any) => {
      callback(null, true);
    },
    credentials: true,
  });
  await app.init();
  return app;
};

let isAppInitialized = false;

export default async function handler(req: any, res: any) {
  if (!isAppInitialized) {
    await createNestApp(server);
    isAppInitialized = true;
  }
  return server(req, res);
}
