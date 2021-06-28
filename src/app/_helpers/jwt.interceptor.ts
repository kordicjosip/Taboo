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

    const authToken: AuthJWTToken | null = this.authService.jwtSubject.getValue();

    const isLoggedIn = authToken != null;
    const isApiUrl = request.url.startsWith(environment.apiURL);
    if (isLoggedIn && isApiUrl && authToken != null) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${authToken.access_token}`},
      });
      this.logger.debug('Added Bearer token to request');
    }

    return next.handle(request);
  }
}
