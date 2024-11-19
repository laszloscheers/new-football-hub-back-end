import { PartialType } from '@nestjs/mapped-types';
import { GetPasswordResetTokenDto } from './get-password-reset-token.dto';

// Partial Type for updating a league that extends the CreateLeagueDto
export class RemovePasswordResetTokenDto extends PartialType(
  GetPasswordResetTokenDto,
) {}
