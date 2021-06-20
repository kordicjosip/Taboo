import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from '@app/_services/auth.service';

import {environment} from '@environments/environment';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';
import {AuthJWTToken} from "@app/_models/auth";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private logger: NGXLogger) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.logger.debug('Intercepting HTTP Request: ', request);

    const user: AuthJWTToken = this.authService.jwtSubject.getValue();

    const isLoggedIn = user != null;
    const isApiUrl = request.url.startsWith(environment.apiURL);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${user.access_token}`},
      });
      this.logger.debug('Added Bearer token to request');
    }

    return next.handle(request);
  }
}
