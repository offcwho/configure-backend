import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeComponent } from '@prisma/client';

export class CreateComponentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEnum(TypeComponent)
    type: TypeComponent;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    price?: number;

    @IsArray()
    @IsOptional()
    images?: any[];
}