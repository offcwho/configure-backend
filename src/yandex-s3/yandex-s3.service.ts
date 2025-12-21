// yandex-s3/yandex-s3.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class yandexS3Service implements OnModuleInit {
  private readonly logger = new Logger(YandexS3Service.name);
  private s3Client: S3Client;
  private bucketName: string;
  private folder: string;
  private cdnDomain?: string;

  constructor(private configService: ConfigService) {
    // Получаем значения с гарантией, что они не undefined
    const accessKeyId = this.getRequiredEnv('YANDEX_S3_ACCESS_KEY');
    const secretAccessKey = this.getRequiredEnv('YANDEX_S3_SECRET_KEY');
    const region = this.configService.get('YANDEX_S3_REGION') || 'ru-central1';
    const endpoint = this.configService.get('YANDEX_S3_ENDPOINT') || 'https://storage.yandexcloud.net';
    
    this.bucketName = this.getRequiredEnv('YANDEX_S3_BUCKET_NAME');
    this.folder = this.configService.get('YANDEX_S3_FOLDER') || 'uploads';
    this.cdnDomain = this.configService.get('YANDEX_CDN_DOMAIN');
    
    // Инициализация S3 клиента с явными типами
    this.s3Client = new S3Client({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.logger.log(`Яндекс S3 инициализирован: ${this.bucketName}`);
  }

  private getRequiredEnv(key: string): string {
    const value = this.configService.get(key);
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  async onModuleInit() {
    await this.testConnection();
  }

  async testConnection() {
    try {
      await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          MaxKeys: 1,
        })
      );
      this.logger.log('✅ Подключение к Яндекс S3 успешно');
    } catch (error) {
      this.logger.error(`❌ Ошибка подключения к Яндекс S3: ${error.message}`);
      throw error;
    }
  }

  async uploadFile(
    file: Express.Multer.File, 
    subfolder: string = 'images'
  ) {
    try {
      // Генерируем уникальное имя файла
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1e9);
      const extension = this.getFileExtension(file.originalname);
      const safeFilename = this.sanitizeFilename(file.originalname);
      const filename = `${timestamp}-${random}-${safeFilename}.${extension}`;
      
      // Полный путь в S3
      const key = `${this.folder}/${subfolder}/${filename}`;
      
      this.logger.debug(`Загрузка файла: ${key}, размер: ${file.size} байт`);

      // Команда для загрузки
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
        ACL: 'public-read',
      });

      // Загружаем файл
      const result = await this.s3Client.send(command);
      
      // URL для доступа к файлу
      const fileUrl = `https://${this.bucketName}.storage.yandexcloud.net/${key}`;
      const cdnUrl = this.cdnDomain 
        ? `https://${this.cdnDomain}/${key}` 
        : undefined;
      
      this.logger.log(`Файл успешно загружен в Яндекс S3: ${fileUrl}`);
      
      return {
        success: true,
        url: fileUrl,
        cdnUrl,
        key: key,
        filename: filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        bucket: this.bucketName,
        etag: result.ETag,
      };
    } catch (error) {
      this.logger.error(`Ошибка загрузки в Яндекс S3: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      
      await this.s3Client.send(command);
      this.logger.log(`Файл удален из Яндекс S3: ${key}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Ошибка удаления файла: ${error.message}`);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        })
      );
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  async generatePresignedUrl(key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    
    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async listFiles(prefix?: string) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix || this.folder,
    });
    
    const result = await this.s3Client.send(command);
    return result.Contents || [];
  }

  private getFileExtension(filename: string): string {
    const ext = filename.slice((Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1);
    return ext.toLowerCase() || 'bin';
  }

  private sanitizeFilename(filename: string): string {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9а-яё-]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100);
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucketName}.storage.yandexcloud.net/${key}`;
  }
}