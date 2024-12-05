import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  Patch,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ActiveUserInterface } from '../common/interfaces/active-user.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { DeleteLeagueDto } from './dto/delete-league.dto';

// Documentation Swagger tag and authentication for Leagues
@ApiTags('Leagues')
@ApiBearerAuth()
@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  // Route to get all leagues owned by a user
  @Get()
  getLeaguesOwnedByUser(@ActiveUser() user: ActiveUserInterface) {
    return this.leaguesService.getLeaguesOwnedByUser(user.id);
  }

  // Route to get a single league owned by a user by ID
  @Get(':id')
  getSingleLeagueOwnedByUserById(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.leaguesService.searchUserLeagueById(id, user.id);
  }

  // Route to create a new league
  @Post('')
  createNewLeague(
    @ActiveUser() user: ActiveUserInterface,
    @Body() dto: CreateLeagueDto,
  ) {
    return this.leaguesService.addLeague(dto, user.id);
  }

  // Route to update a league
  @Patch(':id')
  updateLeague(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.leaguesService.updateLeague(+id, user.id, updateLeagueDto);
  }

  // Route to delete a league
  @Delete('')
  removeLeague(
    @Body() dto: DeleteLeagueDto,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.leaguesService.removeLeague(dto, user.id);
  }
}
