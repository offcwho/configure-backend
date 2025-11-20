import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ConfigureModule } from './configure/configure.module';
import { ComponentModule } from './component/component.module';

@Module({
  imports: [ProductsModule, AuthModule, CartModule, ConfigureModule, ComponentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
