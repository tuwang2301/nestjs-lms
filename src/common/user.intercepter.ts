// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
//
// @Injectable()
// export class UserInterceptor implements NestInterceptor {
//   constructor(private readonly cls: ClsService) {}
//
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     this.cls.set('user', user?.username);
//     return next.handle();
//   }
// }
