import {
  IsDate,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateLeagueDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}