import { IsEmail, MinLength } from "class-validator";

export class UserLogInDto {
    @IsEmail()
    email: string;

    @MinLength(3)
    password: string;
}