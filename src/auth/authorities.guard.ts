import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Authority } from '../common/globalEnum';
import { AUTHORITY_KEY } from './authorities.decorator';

@Injectable()
export class AuthoritiesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAuthorities = this.reflector.getAllAndOverride<Authority[]>(
      AUTHORITY_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredAuthorities) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredAuthorities.some((authority) => {
      return user.roles?.includes(authority);
    });
  }
}
