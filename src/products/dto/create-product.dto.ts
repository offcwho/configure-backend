import { IsString, IsInt } from 'class-validator';
import { IsFile, IsFiles, MaxFileSize, HasMimeType, MemoryStoredFile } from 'nestjs-form-data';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    content: string;

    @IsInt()
    price: number;

    @IsFile() // если одно изображение
    images: MemoryStoredFile;
    // или @IsFiles() для массива файлов
}