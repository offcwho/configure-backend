import { IsInt, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    content: string;

    @IsString()
    images: string;

    @IsInt()
    price: number;
}
