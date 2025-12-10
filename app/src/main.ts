import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Swagger set up
  const config = new DocumentBuilder()
    .setTitle('TechHelpDesk API')
    .setDescription('API documentation for the TechHelpDesk application')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header', name: 'Authorization' },
    'access-token'
  )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.APP_PORT || 3000;
  await app.listen(process.env.PORT ?? port);
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📘 Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
