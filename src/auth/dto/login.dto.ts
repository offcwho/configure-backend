import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5, {message: 'Минимальная длина пароля 5 символов!'})
    password: string;
}

