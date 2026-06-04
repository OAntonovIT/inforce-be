import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

function setupProcessHandlers() {
  process.on('unhandledRejection', (reason: any) => {
    console.error('🔥 UNHANDLED REJECTION:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error(error);
    process.exit(1);
  });
}

async function bootstrap() {
  setupProcessHandlers();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
