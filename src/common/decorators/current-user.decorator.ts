import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | any => {
    const request = ctx.switchToHttp().getRequest();

    const user: JwtPayload | undefined = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Allow extracting a specific field
    // Example: @CurrentUser('id') userId: string
    if (data) {
      return user[data];
    }

    return user;
  },
);
