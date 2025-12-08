import { IsInt, IsString } from "class-validator";

export class CreateFeedbackDto {
    @IsString()
    content: string;
    @IsInt()
    rating: number
}

export class CreateFeedbackToUserDto{
    @IsString()
    content: string;
}
