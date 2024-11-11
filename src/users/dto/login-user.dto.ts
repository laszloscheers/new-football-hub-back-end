import { IsEmail, MinLength } from 'class-validator';

// Creating a DTO to validate the user login request
export class UserLogInDto {
  @IsEmail()
  email: string;

  @MinLength(3)
  password: string;
}
