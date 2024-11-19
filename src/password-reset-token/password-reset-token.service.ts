import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetTokenOutputDto } from './dto/password-reset-token.output.dto';
import { User } from 'src/users/entities/user.entity';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // Method to create a new league
  async createPasswordResetToken(
    dto: CreatePasswordResetTokenDto,
  ): Promise<PasswordResetTokenOutputDto> {
    const user = await this.userRepository.findOneBy({ email: dto.ownerEmail });

    const newPasswordResetToken = this.passwordResetTokenRepository.create({
      token: uuid4(),
      expiresAt: new Date(new Date().getTime() + 3600 * 1000),
      owner: { id: user.id },
    });

    const passwordResetToken = await this.passwordResetTokenRepository.save(
      newPasswordResetToken,
    );

    return PasswordResetTokenOutputDto.fromEntity(passwordResetToken);
  }

  async findOnePasswordResetToken(
    token: string,
  ): Promise<PasswordResetTokenOutputDto> {
    const tokenObject = await this.passwordResetTokenRepository.findOne({
      relations: ['owner'], // Including owner relation
      where: {
        token,
      },
    });

    if (!tokenObject) {
      throw new BadRequestException(`Token ${token} not found`);
    }
    return PasswordResetTokenOutputDto.fromEntity(tokenObject);
  }

  async removePasswordResetToken(token: string): Promise<DeleteResult> {
    await this.findOnePasswordResetToken(token);
    return await this.passwordResetTokenRepository.delete({ token });
  }
}
