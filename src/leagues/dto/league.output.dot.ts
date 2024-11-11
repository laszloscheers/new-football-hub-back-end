import { League } from '../entities/league.entity';

export class LeagueOutputDto {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly ownerId: number,
    readonly ownerEmail: string,
  ) {}

  // Static method to create a LeagueOutputDto from a League entity
  static fromEntity(league: League) {
    return new LeagueOutputDto(
      league.id,
      league.name,
      league.owner.id,
      league.owner.email,
    );
  }
}
