import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { League } from './models/league.model';
import { Repository } from 'typeorm';
import { LeagueOutputDto } from './dto/league.output.dot';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
  ) {}

  private async retrieveAllUserLeagues(ownerId): Promise<League[]> {
    return this.leagueRepository.find({
      relations: ['owner'],
      where: {
        owner: {
          id: ownerId,
        },
      },
    });
  }

  private async getUserLeaguesById(
    id: number,
    ownerId: number,
  ): Promise<League> {
    const league = this.leagueRepository.findOne({
      relations: ['owner'],
      where: {
        owner: {
          id: ownerId,
        },
        id,
      },
    });

    if (!league) {
      throw new BadRequestException(`League with id ${id} not found`);
    }
    return league;
  }

  private async insertNewLeague(params: {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    ownerId: number;
  }): Promise<LeagueOutputDto> {
    const newLeague = this.leagueRepository.create({
      name: params.name,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      owner: { id: params.ownerId },
    });

    const league = await this.leagueRepository.save(newLeague);

    return LeagueOutputDto.fromEntity(league);
  }

  async getLeaguesOwnedByUser(ownerId: number): Promise<LeagueOutputDto[]> {
    const leagues = await this.retrieveAllUserLeagues(ownerId);
    return leagues.map((league) => LeagueOutputDto.fromEntity(league));
  }

  async searchUserLeagueById(
    id: number,
    ownerId: number,
  ): Promise<LeagueOutputDto | undefined> {
    const userLeague = await this.getUserLeaguesById(id, ownerId);

    if (!userLeague) {
      throw new NotFoundException(`Can not find league with id ${id}`);
    }

    return LeagueOutputDto.fromEntity(userLeague);
  }

  async addLeague(
    dto: CreateLeagueDto,
    ownerId: number,
  ): Promise<LeagueOutputDto> {
    return this.insertNewLeague({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId,
    });
  }

  async remove(id: number, ownerId: number) {
    await this.getUserLeaguesById(id, ownerId);
    return await this.leagueRepository.delete({ id });
  }
}
