import { IsInt, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    content: string;

    @IsInt()
    price: number;
}
