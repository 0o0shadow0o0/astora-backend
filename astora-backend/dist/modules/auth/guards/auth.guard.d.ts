import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const AuthGuard_base: any;
export declare class AuthGuard extends AuthGuard_base {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): any;
}
export {};
