import { IsEmail, IsString } from 'class-validator';

export class GetUSerDto {
  @IsString()
  @IsEmail()
  email: string;
}
