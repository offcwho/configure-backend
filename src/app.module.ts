import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ConfigureModule } from './configure/configure.module';
import { ComponentModule } from './component/component.module';
import { PrismaService } from './prisma/prisma.service';
import { OrderModule } from './order/order.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RefererMiddleware } from './middleware/referer.middleware';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { ConfigModule } from '@nestjs/config';
import { YandexS3Module } from './yandex-s3/yandex-s3.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    YandexS3Module,
    ProductsModule,
    AuthModule,
    CartModule,
    ConfigureModule,
    ComponentModule,
    OrderModule,
    UploadModule,
    FeedbacksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
