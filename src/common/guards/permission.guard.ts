import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '@/modules/auth/decorators/permission.decorator';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ✅ 1. CHECK IF ROUTE IS PUBLIC (method OR controller)
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (isPublic) {
      return true;
    }

    // ✅ 2. GET PERMISSION (method OR controller)
    const permission = this.reflector.getAllAndOverride(
      PERMISSION_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ❌ No user → NOT AUTHENTICATED
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // ✅ SUPER ADMIN BYPASS
    if (user.isSuperAdmin) {
      return true;
    }

    // ✅ No permission decorator → just authenticated
    if (!permission) {
      return true;
    }

    const { module, action } = permission;

    const modulePermissions = user.permissions?.[module];

    if (!modulePermissions) {
      throw new ForbiddenException(
        `No access to module ${module}`,
      );
    }

    if (!modulePermissions[action]) {
      throw new ForbiddenException(
        `No permission to ${action} on ${module}`,
      );
    }

    return true;
  }
}