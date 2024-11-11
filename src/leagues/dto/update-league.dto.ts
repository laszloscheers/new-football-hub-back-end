import { PartialType } from '@nestjs/mapped-types';
import { CreateLeagueDto } from './create-league.dto';

// Partial Type for updating a league that extends the CreateLeagueDto
export class UpdateLeagueDto extends PartialType(CreateLeagueDto) {}
