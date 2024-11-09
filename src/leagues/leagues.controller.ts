import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';

@Controller()
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get('leagues')
  getLeaguesOwnedByUser(@ActiveUser() user: ActiveUserInterface) {
    return this.leaguesService.getLeaguesOwnedByUser(user.id);
  }

  @Get('leagues/:id')
  getSingleLeagueOwnedByUserById(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.leaguesService.searchUserLeagueById(id, user.id);
  }

  @Post('leagues')
  createNewLeague(
    @ActiveUser() user: ActiveUserInterface,
    @Body() dto: CreateLeagueDto,
  ) {
    return this.leaguesService.addLeague(dto, user.id);
  }

  @Delete('leagues/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.leaguesService.remove(id, user.id);
  }
}
