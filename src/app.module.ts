import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.model';
import 'dotenv/config';
import { JwtModule } from '@nestjs/jwt';
import { LeaguesModule } from './leagues/leagues.module';
import { League } from './leagues/models/league.model';

@Module({
  imports: [
    UsersModule,
    LeaguesModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: DB_HOST,
      port: parseInt(DB_PORT),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [User, League],
      synchronize: DB_SYNCHRONIZE === 'true',
    }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [],
})
export class AppModule {}
