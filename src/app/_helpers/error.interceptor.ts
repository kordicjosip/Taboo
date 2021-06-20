import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AuthService} from '@app/_services/auth.service';
import {NGXLogger} from 'ngx-logger';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private logger: NGXLogger) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].includes(err.status) && this.authService.jwtSubject.getValue().isValid()) {
        this.logger.debug('Credentials expired or not logged in');
        this.authService.logout();
      }

      const error = (err && err.error && err.error.message) || err.statusText;
      this.logger.error(err);
      return throwError(error);
    }));
  }
}
