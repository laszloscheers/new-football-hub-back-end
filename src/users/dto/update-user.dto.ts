import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Extending the CreateUserDto with the PartialType utility to create an UpdateUserDto
export class UpdateUserDto extends PartialType(CreateUserDto) {}
