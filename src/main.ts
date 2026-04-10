import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.enableCors();
  /*
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
*/
app.enableCors({
  origin: true,
  credentials: true,
});

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  
  // ======= Swagger setup =======
  const config = new DocumentBuilder()
    .setTitle('HR Backend API')
    .setDescription('API documentation for HR system')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

 
  const document = SwaggerModule.createDocument(app, config, {
  deepScanRoutes: true,          // ← This is the key line you're missing
  // Optional but helpful: ignore global prefix or extra paths if needed
  // ignoreGlobalPrefix: false,
});

  SwaggerModule.setup('api-docs', app, document); // Swagger UI available at /api-docs

  // =============================

  const port = process.env.PORT || 3005;  // ← Use Render's PORT, fallback for local
  //await app.listen(port, '0.0.0.0');      // ← Bind to 0.0.0.0 explicitly use on render
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📄 Swagger docs available at: http://localhost:${port}/api-docs`);
}
bootstrap();
