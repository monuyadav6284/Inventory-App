import {
    ExecutionContext,
    SetMetadata,
    createParamDecorator,
  } from '@nestjs/common';
  import { Request } from 'express';
  
  export const Public = () => SetMetadata('isPublic', true);
  
  export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request: Request = ctx.switchToHttp().getRequest();
      return request.user;
    },
  );
  