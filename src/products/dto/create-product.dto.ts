import { IsString, IsInt } from 'class-validator';
import { IsFile, IsFiles, MaxFileSize, HasMimeType, MemoryStoredFile } from 'nestjs-form-data';

export class CreateProductDto {
    name: string;
    description?: string;
    content?: string;
    price: string;
    images: MemoryStoredFile;
}