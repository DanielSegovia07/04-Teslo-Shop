import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap')

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,
      forbidNonWhitelisted: true,
    })
  )


const config = new DocumentBuilder()
  .setTitle('Teslo RESTFul API')
  .setDescription('Teslo shop endpoints')
  .setVersion('4.0')
  // Agregar configuración para BearerAuth
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
  'Authorization', )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT as string );
  logger.log(`App runing`)
}
bootstrap();
