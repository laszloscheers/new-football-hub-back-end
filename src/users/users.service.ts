import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserSignUpDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { UserLogInDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService, // Injecting JWT service
  ) {}

  // Private method to find a user by email including the password
  private findByEmailWithPassword(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'hashPassword', 'role'], // Selecting specific fields including password
    });
  }

  //-------------- PUBLIC METHODS --------------//

  // Method to handle user sign up
  async signUp(dto: UserSignUpDto): Promise<void> {
    // Check if user already exists
    const user = await this.findByEmailWithPassword(dto.email);
    if (user) {
      throw new UnauthorizedException(`Email ${dto.email} already exist`);
    }

    // Create new user entity
    const newUser = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      surname: dto.surname,
      preferredMode: dto.preferredMode,
      preferredLanguage: dto.preferredLanguage,
      hashPassword: await bcrypt.hash(dto.password, 12), // Hash the password
      createdAt: new Date(), // Setting creation date
      updatedAt: new Date(), // Setting update date
    });

    // Save the user to the database
    await this.userRepository.save(newUser);
  }

  // Method to handle user login
  async logIn(dto: UserLogInDto): Promise<{ token: string }> {
    const user = await this.findByEmailWithPassword(dto.email);

    // Find user by email including the password
    if (!user) {
      throw new UnauthorizedException(`Email ${dto.email} does not exist`);
    }

    // Compare the provided password with the stored hash password
    const matches = await bcrypt.compare(dto.password, user.hashPassword);

    if (!matches) {
      throw new UnauthorizedException(
        'The password does not match this user password',
      );
    }

    // Generate JWT token and return it
    return {
      token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  //-------------- ADMIN METHODS ------------//

  // Method to create a new user
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const user = this.userRepository.create({
      name: createUserDto.name,
      surname: createUserDto.surname,
      preferredMode: createUserDto.preferredMode,
      preferredLanguage: createUserDto.preferredLanguage,
      role: createUserDto.role,
      email: createUserDto.email,
      hashPassword: await bcrypt.hash(createUserDto.password, 12), // Hashing the password
      createdAt: new Date(), // Setting creation date
      updatedAt: new Date(), // Setting update date
    });
    await this.userRepository.save(user); // Saving the user to the database
  }

  // Method to find all users
  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Method to find one user by ID
  async findOneUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  // Method to update a user
  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    await this.findOneUserById(id); // Ensure user exists
    return await this.userRepository.update(id, {
      ...updateUserDto,
      updatedAt: new Date(), // Update the updatedAt field
    });
  }

  // Method to remove a user
  async removeUser(id: number): Promise<DeleteResult> {
    await this.findOneUserById(id); // Ensure user exists
    return await this.userRepository.delete({ id }); // Deletes the user
  }
}
