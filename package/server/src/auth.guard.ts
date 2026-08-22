import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

function validateRequest(request: Request): boolean {
  const authHeader = request.headers?.authorization;
  const expected = process.env.CHECK_AUTH;

  if (!expected || authHeader !== expected) {
    throw new UnauthorizedException('达咩！你没有权限操作哦！');
  }
  return true;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
