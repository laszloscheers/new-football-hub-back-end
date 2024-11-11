import { Role } from '../../common/enums/rol.enum';
import { League } from '../../leagues/entities/league.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from '../enums/language.enum';
import { Mode } from '../enums/user-mode.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ type: 'enum', default: Mode.LIGHT, enum: Mode })
  preferredMode: Mode;

  @Column({ type: 'enum', default: Language.ESPAÑOL, enum: Language })
  preferredLanguage: Language;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  hashPassword: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany((type) => League, (league) => league.owner, { nullable: false })
  leagues: League[];
}
