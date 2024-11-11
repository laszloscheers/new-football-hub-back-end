import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/rol.enum';

// Creating a decorator to mark routes with the required roles
export const ROLES_KEY = 'roles';
export const Roles = (role: Role) => SetMetadata(ROLES_KEY, role);
