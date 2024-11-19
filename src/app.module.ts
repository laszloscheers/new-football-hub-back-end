import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import 'dotenv/config';
import { JwtModule } from '@nestjs/jwt';
import { LeaguesModule } from './leagues/leagues.module';
import { League } from './leagues/entities/league.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordResetTokenModule } from './password-reset-token/password-reset-token.module';
import { PasswordResetToken } from './password-reset-token/entities/password-reset-token.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './users/guards/auth.guard';
import { RolesGuard } from './users/guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    LeaguesModule,
    PasswordResetTokenModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any, // Database type
      host: process.env.DB_HOST, // Database host
      port: parseInt(process.env.DB_PORT), // Database port
      username: process.env.DB_USERNAME, // Database username
      password: process.env.DB_PASSWORD, // Database password
      database: process.env.DB_NAME, // Database name
      entities: [User, League, PasswordResetToken], // Entities to be used
      synchronize: process.env.DB_SYNCHRONIZE === 'true', // Synchronize database schema depending on the environment
    }),
    // Configuring JWT module asynchronously so the JWT secret can be injected from the environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // JWT secret
        global: true,
        signOptions: { expiresIn: '7d' }, // JWT sign options
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
  providers: [
    {
      provide: APP_GUARD, // Providing AuthGuard as a global guard
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD, // Providing RolesGuard as a global guard
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
