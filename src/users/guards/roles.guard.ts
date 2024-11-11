import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Implementing canActivate method to check if the user has the required role
  canActivate(context: ExecutionContext): boolean {
    // Reading the role metadata from the route handler or class
    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If there is no role metadata set on the controller, return true (no role required)
    if (!role) {
      return true;
    }

    // Extracting the user from the request object
    const { user } = context.switchToHttp().getRequest();

    // If the user is an admin, always return true
    if (user.role === Role.ADMIN) {
      return true;
    }

    // If the user is the same role as the required role, return true
    return role === user.role;
  }
}
