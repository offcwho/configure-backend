import { Type } from 'class-transformer';
import { IsString, IsInt } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;
    @IsString()
    description: string;
    @IsString()
    content: string;
    @Type(() => Number)
    @IsInt()
    price: number;
}