import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { LeagueOutputDto } from './dto/league.output.dot';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { DeleteLeagueDto } from './dto/delete-league.dto';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>, // Injecting League repository
  ) {}

  // Method to get leagues owned by a specific user
  async getLeaguesOwnedByUser(ownerId: number): Promise<LeagueOutputDto[]> {
    const leagues = await this.leagueRepository.find({
      relations: ['owner'], // Including owner relation
      where: {
        owner: {
          id: ownerId, // Filtering by owner ID
        },
      },
    });
    return leagues.map((league) => LeagueOutputDto.fromEntity(league));
  }

  // // Method to find a league by ID owned by a specific user
  async searchUserLeagueById(
    id: number,
    ownerId: number,
  ): Promise<LeagueOutputDto | undefined> {
    const userLeague = await this.leagueRepository.findOne({
      relations: ['owner'],
      where: {
        owner: {
          id: ownerId,
        },
        id,
      },
    });

    if (!userLeague) {
      throw new BadRequestException(`League with id ${id} not found`);
    }

    return LeagueOutputDto.fromEntity(userLeague);
  }

  // // Method to find a league by ID owned by a specific user
  async searchUserLeagueByName(
    name: string,
    ownerId: number,
  ): Promise<LeagueOutputDto | undefined> {
    const userLeague = await this.leagueRepository.findOne({
      relations: ['owner'],
      where: {
        owner: {
          id: ownerId,
        },
        name,
      },
    });

    if (!userLeague) {
      throw new BadRequestException(`League with name ${name} not found`);
    }

    return LeagueOutputDto.fromEntity(userLeague);
  }
  // Method to create a new league
  async addLeague(
    dto: CreateLeagueDto,
    ownerId: number,
  ): Promise<LeagueOutputDto> {
    const newLeague = this.leagueRepository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: { id: ownerId },
    });
    const league = await this.leagueRepository.save(newLeague);

    return LeagueOutputDto.fromEntity(league);
  }

  // Method to update a league
  async updateLeague(
    id: number,
    ownerId: number,
    updateLeagueDto: UpdateLeagueDto,
  ): Promise<UpdateResult> {
    await this.searchUserLeagueById(id, ownerId);
    return await this.leagueRepository.update(id, {
      ...updateLeagueDto,
      updatedAt: new Date(),
    });
  }

  // Method to delete a league
  async removeLeague(
    dto: DeleteLeagueDto,
    ownerId: number,
  ): Promise<DeleteResult> {
    const league = await this.searchUserLeagueByName(dto.name, ownerId);
    return await this.leagueRepository.delete({ id: league.id });
  }
}
