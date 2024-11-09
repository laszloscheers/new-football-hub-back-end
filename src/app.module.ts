import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.model';
import 'dotenv/config';
import { JwtModule } from '@nestjs/jwt';
import { LeaguesModule } from './leagues/leagues.module';
import { League } from './leagues/models/league.model';
import { DbTypeDto } from './users/dto/db-type.dto';

@Module({
  imports: [
    UsersModule,
    LeaguesModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, League],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [],
})
export class AppModule {}
