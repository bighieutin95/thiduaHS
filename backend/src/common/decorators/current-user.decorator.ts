import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator @CurrentUser() để lấy thông tin user đã xác thực
 * từ request object trong Controller.
 *
 * Ví dụ sử dụng:
 * @Get('profile')
 * getProfile(@CurrentUser() user: any) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
