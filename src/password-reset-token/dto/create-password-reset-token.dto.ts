import { IsEmail } from 'class-validator';

export class CreatePasswordResetTokenDto {
  @IsEmail()
  ownerEmail: string;
}
