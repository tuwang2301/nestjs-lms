import { SetMetadata } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((data, req) => {
    return req.user;
});
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
