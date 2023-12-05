import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import V1Module from '@v1/v1.module';
import ValidationUserPermissionMiddleware from '@middleware/validate-user-permissions.middleware';
import AuthModule from '@v1/auth/auth.module';
import { AppController } from './app.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SERVER_HOST: Joi.string().required(),
        SERVER_PORT: Joi.number().required(),
        SWAGGER_USER: Joi.string().required(),
        SWAGGER_PASSWORD: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        ACCESS_TOKEN_USER: Joi.string().required(),
        REFRESH_TOKEN_USER: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_CACHE_EXPIRES: Joi.number().required(),
      }),
    }),
    RedisModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        readyLog: true,
        config: {
          host: cfg.get('REDIS_HOST'),
          port: cfg.get('REDIS_PORT'),
          password: cfg.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    V1Module,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidationUserPermissionMiddleware)
      .forRoutes({ path: '/*', method: RequestMethod.ALL });
  }
}
