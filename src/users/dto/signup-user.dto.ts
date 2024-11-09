import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Language } from '../enums/language.enum';
import { Mode } from '../enums/user-mode.enum';

export class UserSignUpDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  surname: string;

  @IsString()
  @IsIn([Mode.LIGHT, Mode.DARK])
  @IsOptional()
  preferredMode: Mode;

  @IsString()
  @IsIn([Language.ESPAÑOL, Language.ENGLISH])
  @IsOptional()
  preferredLanguage: Language;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
