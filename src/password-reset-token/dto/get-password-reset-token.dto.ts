import { IsEmail, IsString } from 'class-validator';

export class GetPasswordResetTokenDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
