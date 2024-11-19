import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/signup-user.dto';
import { IsPublic } from './decorators/is-public.decorator';
import { UserLogInDto } from './dto/login-user.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from '../common/enums/rol.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

// Swagger tag for Users controller
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //-------------- PUBLIC METHODS --------------//

  // Public route for user sign up
  @IsPublic()
  @Post('signup')
  async signUp(@Body() dto: UserSignUpDto) {
    const user = await this.usersService.signUp(dto);
  }

  // Public route for user login
  @IsPublic()
  @Post('login')
  async logIn(@Body() dto: UserLogInDto) {
    return this.usersService.logIn(dto);
  }

  //-------------- ADMIN METHODS --------------//

  // Route to create a new user
  @ApiBearerAuth() // Adding Bearer authentication for documentation so token can be added
  @Post()
  @Roles(Role.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // Route to get all users
  @ApiBearerAuth()
  @Get()
  @Roles(Role.ADMIN)
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  // Route to get a user by email
  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.ADMIN)
  findOneUserById(@Param('id', ParseIntPipe) id: string): Promise<User> {
    return this.usersService.findOneUserById(+id);
  }

  // Route to get a user by email
  @ApiBearerAuth()
  @Get('/email/:email')
  @Roles(Role.ADMIN)
  findOneUserByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneUserByEmail(email);
  }

  // Route to update a user by ID
  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.ADMIN)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  // Route to delete a user by ID
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.ADMIN)
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}
