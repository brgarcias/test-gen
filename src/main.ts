import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import basicAuth from 'express-basic-auth';
import { AppModule } from './modules/app/app.module';
import { PrismaNotFoundExceptionFilter } from './exception-filters/prisma-not-found.exception-filter';

const port: number = parseInt(process.env.SERVER_PORT);
const host: string = process.env.SERVER_HOST;

async function bootstrap(): Promise<void> {
  const app: INestApplication = await createNestApplication();
  configureSwaggerBasicAuth(app);
  configureSwaggerDocumentation(app);
  configureGlobalSettings(app);

  await startApplication(app);
}

async function createNestApplication(): Promise<INestApplication> {
  return await NestFactory.create(AppModule, { cors: false });
}

function configureSwaggerBasicAuth(app: INestApplication): void {
  const swaggerUser: string = process.env.SWAGGER_USER;
  const swaggerPassword: string = process.env.SWAGGER_PASSWORD;

  const swaggerAuthOptions = {
    challenge: true,
    users: { [swaggerUser]: swaggerPassword },
  };

  app.use(['/docs', '/docs-json'], basicAuth(swaggerAuthOptions));
}

function configureSwaggerDocumentation(app: INestApplication): void {
  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
    },
    customCssUrl: '../css/theme-flattop.css',
    customSiteTitle: 'Test Gen API V1.0',
  };

  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const swaggerDocumentBuilder = new DocumentBuilder()
    .setTitle('Test Gen API V1.0')
    .setDescription('Test Gen API Documentation')
    .addServer(host, process.env.APP_ENV)
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentBuilder,
    swaggerDocumentOptions,
  );
  SwaggerModule.setup('docs', app, swaggerDocument, swaggerOptions);
}

function configureGlobalSettings(app: INestApplication): void {
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));
  app.useGlobalFilters(new PrismaNotFoundExceptionFilter());
  app.use(cookieParser());
}

async function startApplication(app: INestApplication): Promise<void> {
  await app.listen(port);
  console.log(`Application is running on: ${host}`);
}

bootstrap();
