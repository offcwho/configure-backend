import { Transform } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    content: string;

    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    price: number;
}
