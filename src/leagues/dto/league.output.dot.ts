import { League } from "../models/league.model";

export class LeagueOutputDto {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly ownerId: number,
    readonly ownerEmail: string,
  ) {}

  static fromEntity(league: League) {
    return new LeagueOutputDto(
      league.id,
      league.name,
      league.owner.id,
      league.owner.email,
    );
  }
}
