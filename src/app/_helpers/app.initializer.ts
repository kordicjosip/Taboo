import {AuthService} from '@app/_services/auth.service';
import {NGXLogger} from 'ngx-logger';
import {EMPTY} from 'rxjs';
import {AuthJWTToken} from "@app/_models/auth";

export function appInitializer(authService: AuthService, logger: NGXLogger) {
  return () => new Promise(resolve => {

    authService.korisnikLoginSubject.subscribe(
      (token: AuthJWTToken) => {
        if (token != null && !token.accessTokenIsValid()) {
          logger.debug('JWT expired');
          // TODO refresh
          // this.korisnikLoginSubject.next()
        }
      }
    )
    EMPTY.subscribe().add(resolve);
  });
}
