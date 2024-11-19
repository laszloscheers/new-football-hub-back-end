import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expiresAt: Date;

  @Column()
  token: string;

  @ManyToOne((type) => User, (user) => user.passwordResetTokens)
  owner: User;
}
