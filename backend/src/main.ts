import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Đặt prefix /api cho tất cả routes
  app.setGlobalPrefix('api');

  // Kích hoạt global validation pipe (sử dụng class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Lọc bỏ các field không được khai báo trong DTO
      transform: true,       // Tự động chuyển đổi kiểu dữ liệu
      forbidNonWhitelisted: true,
    }),
  );

  // Cấu hình CORS cho phép Frontend call API linh hoạt trên Vercel
  app.enableCors({
    origin: (origin: any, callback: any) => {
      callback(null, true);
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 ThiDuaHS Backend đang chạy tại: http://localhost:${port}/api`);
}
bootstrap();
