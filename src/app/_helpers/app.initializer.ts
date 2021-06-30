import {AuthService} from '@app/_services/auth.service';
import {NGXLogger} from 'ngx-logger';
import {EMPTY} from 'rxjs';
import {AuthJWTToken} from "@app/_models/auth";
import {UserService} from "@app/_services/user.service";
import {User} from "@app/_models/user";

export function appInitializer(authService: AuthService, logger: NGXLogger, userService: UserService) {
  return () => new Promise(resolve => {

    authService.jwtSubject.subscribe(
      (token: AuthJWTToken | null) => {
        if (token != null && !token.accessTokenIsValid()) {
          logger.debug('JWT expired');
          return authService.refreshToken().subscribe(
            () => {
              return userService.getUserDetails().subscribe(
                (user: User) => {
                  authService.korisnikSubject.next(user);
                  logger.debug("Got user: " + JSON.stringify(user));
                  return EMPTY.subscribe().add(resolve);
                });
            }
          );
        } else if (token != null && token.accessTokenIsValid()) {
          return userService.getUserDetails().subscribe(
            (user: User) => {
              authService.korisnikSubject.next(user);
              logger.debug("Got user: " + JSON.stringify(user));
              return EMPTY.subscribe().add(resolve);
            }
          );
        } else {
          logger.debug('Initialized app');
          return EMPTY.subscribe().add(resolve);
        }
      }
    )
  });
}
