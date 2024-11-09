import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserSignUpDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { UserLogInDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'hashPassword', 'role'],
    });
  }

  async signUp(dto: UserSignUpDto) {
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      surname: dto.surname,
      preferredMode: dto.preferredMode,
      preferredLanguage: dto.preferredLanguage,
      hashPassword: await bcrypt.hash(dto.password, 12),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.userRepository.save(user);
  }

  async logIn(dto: UserLogInDto) {
    const user = await this.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new UnauthorizedException(`Email ${dto.email} does not exist`);
    }

    const matches = await bcrypt.compare(dto.password, user.hashPassword);

    if (!matches) {
      throw new UnauthorizedException(
        'The password does not match this user password',
      );
    }

    return {
      token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      name: createUserDto.name,
      surname: createUserDto.surname,
      preferredMode: createUserDto.preferredMode,
      preferredLanguage: createUserDto.preferredLanguage,
      role: createUserDto.role,
      email: createUserDto.email,
      hashPassword: await bcrypt.hash(createUserDto.password, 12),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return await this.userRepository.update(id, {
      ...UpdateUserDto,
      updatedAt: new Date(),
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.userRepository.delete({ id });
  }
}
