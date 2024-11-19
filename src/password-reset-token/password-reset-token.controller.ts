import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PasswordResetTokenService } from './password-reset-token.service';
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto';
import { DeleteResult } from 'typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/users/decorators/roles.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { PasswordResetTokenOutputDto } from './dto/password-reset-token.output.dto';

@Controller('password-reset-token')
export class PasswordResetTokenController {
  constructor(
    private readonly passwordResetTokenService: PasswordResetTokenService,
  ) {}

  @ApiBearerAuth()
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    return this.passwordResetTokenService.createPasswordResetToken(
      createPasswordResetTokenDto,
    );
  }

  @ApiBearerAuth()
  @Get(':token')
  @Roles(Role.ADMIN)
  findOne(
    @Param('token') getPasswordResetTokenDto: string,
  ): Promise<PasswordResetTokenOutputDto> {
    return this.passwordResetTokenService.findOnePasswordResetToken(
      getPasswordResetTokenDto,
    );
  }

  @ApiBearerAuth()
  @Delete(':token')
  @Roles(Role.ADMIN)
  remove(@Param('token') token: string): Promise<DeleteResult> {
    return this.passwordResetTokenService.removePasswordResetToken(token);
  }
}
