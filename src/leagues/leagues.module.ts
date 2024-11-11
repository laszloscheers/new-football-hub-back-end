import { Module } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './entities/league.entity';

@Module({
  imports: [TypeOrmModule.forFeature([League])],
  controllers: [LeaguesController],
  providers: [LeaguesService],
})
export class LeaguesModule {}
