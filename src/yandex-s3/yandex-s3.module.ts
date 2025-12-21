// yandex-s3/yandex-s3.module.ts
import { Module, Global } from '@nestjs/common';
import { YandexS3Service } from './yandex-s3.service';
import { ConfigModule } from '@nestjs/config';

@Global() // Делаем сервис глобально доступным
@Module({
    imports: [ConfigModule],
    providers: [YandexS3Service],
    exports: [YandexS3Service],
})
export class YandexS3Module { }