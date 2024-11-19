import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AppModule } from '../app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Importing TypeORM module for User entity
    forwardRef(() => AppModule), // Forward reference to AppModule to resolve circular dependency
  ],
  controllers: [UsersController], // Registering UsersController
  providers: [
    UsersService, // Registering UsersService
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
