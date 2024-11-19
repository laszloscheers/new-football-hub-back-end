import { Module } from '@nestjs/common';
import { PasswordResetTokenService } from './password-reset-token.service';
import { PasswordResetTokenController } from './password-reset-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { RolesGuard } from 'src/users/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken]), UsersModule],
  controllers: [PasswordResetTokenController],
  providers: [
    PasswordResetTokenService,
    UsersService,
    JwtService,
    UsersService, // Registering UsersService
  ],
})
export class PasswordResetTokenModule {}
