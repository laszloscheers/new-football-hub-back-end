import { IsIn } from 'class-validator';

export class DbTypeDto {
  @IsIn(['mariadb', 'mysql'])
  type: string;
}
