import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, // Injecting JWT service
    private reflector: Reflector, // Injecting Reflector service to read metadata
  ) {}

  // Implementing canActivate method to check if the user is authenticated
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    // Checking if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass,
    ]);

    // If the route is public, return true
    if (isPublic) {
      return true;
    }

    // If the token is not provided, throw an UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }

    // Verifying the token and attaching the user to the request
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch (exception) {
      return false;
    }

    // If the user is not attached to the request, throw a BadRequestException
    if (!request.user.id) {
      throw new BadRequestException(
        'The provided token does not include a valid user ID',
      );
    }

    return true;
  }
}
