import {AuthService} from '@app/_services/auth.service';
import {NGXLogger} from 'ngx-logger';
import {EMPTY} from 'rxjs';
import {AuthJWTToken} from "@app/_models/auth";

export function appInitializer(authService: AuthService, logger: NGXLogger) {
  return () => new Promise(resolve => {

    authService.jwtSubject.subscribe(
      (token: AuthJWTToken) => {
        if (token != null && !token.accessTokenIsValid()) {
          logger.debug('JWT expired');
          authService.refreshToken();
        }
        logger.debug('Initialized app');
        return EMPTY.subscribe().add(resolve);
      }
    )
  });
}
