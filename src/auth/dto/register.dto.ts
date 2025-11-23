import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(Role)
    role: Role

    @IsString()
    @MinLength(5, { message: 'Минимальная длина пароля 5 символов!' })
    password: string;
}