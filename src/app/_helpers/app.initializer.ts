import {NGXLogger} from 'ngx-logger';
import {EMPTY} from 'rxjs';
import {AuthService} from "@app/_services/auth.service";
import {UserService} from "@app/_services/user.service";

export function appInitializer(logger: NGXLogger, authService: AuthService, userService: UserService) {
  return () => new Promise(resolve => {

    authService.jwtSubject.subscribe(token => {
        if (token != null && token.accessTokenIsValid()) {
          return userService.getUserDetails('me').subscribe(
            user => {
              authService.korisnikSubject.next(user)
              // Tek kad se dobiju detalji o korisniku označi kao predinicijalizaciju aplikacije
              logger.debug("Initialized app");
              return EMPTY.subscribe().add(resolve);
            }
          )
        }
        else return EMPTY.subscribe().add(resolve);
      }
    )
    authService.jwtSubject.subscribe(
      jwtSubject => {
        if (jwtSubject != null) {
          if (jwtSubject.accessTokenIsValid()) {
            authService.startRefreshTokenTimer();
          } else {
            authService.refreshToken().subscribe();
          }
        }
      }
    )
  });
}
