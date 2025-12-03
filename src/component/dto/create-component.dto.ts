import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeComponent } from 'src/generated/prisma/enums';

export class CreateComponentDto {
    @IsString()
    name: string;

    @IsEnum(TypeComponent)
    type: TypeComponent;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    price?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    watt?: number;

    @IsArray()
    @IsOptional()
    images?: any[];
}