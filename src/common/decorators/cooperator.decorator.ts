import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CooperatorPayload {
  id: string;
  name: string;
  email: string;
}

export const CurrentCooperator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CooperatorPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.cooperator;
  },
);
