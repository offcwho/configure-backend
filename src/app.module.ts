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
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
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
export class AppModule {}
