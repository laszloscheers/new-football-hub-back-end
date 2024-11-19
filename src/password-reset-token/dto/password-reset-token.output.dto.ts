import { PasswordResetToken } from '../entities/password-reset-token.entity';

export class PasswordResetTokenOutputDto {
  constructor(
    readonly id: number,
    readonly expiresAt: Date,
    readonly token: string,
    readonly ownerEmail: string,
  ) {}

  // Static method to create a LeagueOutputDto from a League entity
  static fromEntity(passwordResetToken: PasswordResetToken) {
    return new PasswordResetTokenOutputDto(
      passwordResetToken.id,
      passwordResetToken.expiresAt,
      passwordResetToken.token,
      passwordResetToken.owner.email,
    );
  }
}
