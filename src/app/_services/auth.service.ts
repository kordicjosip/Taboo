import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AuthJWTToken} from "@app/_models/auth";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwt_token_key = 'jwt'
  jwtSubject: BehaviorSubject<AuthJWTToken | any>;

  // TODO podatci o korisniku
  // korisnikSubject: BehaviorSubject<any>;

  private refreshTokenTimeout: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private logger: NGXLogger
  ) {
    const token = localStorage.getItem(this.jwt_token_key)
    if (token == null) {
      logger.debug('User not available')
      this.jwtSubject = new BehaviorSubject(null);
    } else {
      logger.debug('User needs to be validated')
      this.jwtSubject = new BehaviorSubject((JSON.parse(token)));
      if (this.jwtSubject.getValue().accessTokenIsValid()) {
        this.startRefreshTokenTimer();
      } else {
        this.refreshToken();
      }
    }
  }

  login(username: string, password: string, saveLogin: boolean): Observable<AuthJWTToken> {
    return this.http.post<any>(`${environment.apiURL}auth/login`, {username, password}, {withCredentials: false})
      .pipe(map(jwt => {
        this.jwtSubject.next(new AuthJWTToken(jwt));
        if (saveLogin) {
          this.startRefreshTokenTimer();
          this.saveCredidentials(this.jwtSubject.getValue())
        }
        return this.jwtSubject.getValue();
      }));
  }

  saveCredidentials(token: AuthJWTToken) {
    this.logger.debug('Saving user credidentials');
    localStorage.setItem(this.jwt_token_key, JSON.stringify(token))
  }

  logout() {
    this.logger.debug('Logging out user');
    this.stopRefreshTokenTimer();
    localStorage.removeItem(this.jwt_token_key);
    this.jwtSubject.next(null);
  }

  refreshToken() {
    this.logger.debug('Token refresh: start');
    const token: AuthJWTToken = this.jwtSubject.getValue();
    return this.http.post<any>(`${environment.apiURL}auth/refresh`, {refresh_token: token.refresh_token}, {withCredentials: false})
      .pipe(map(korisnikLogin => {
        this.jwtSubject.next(korisnikLogin);
        this.startRefreshTokenTimer();
        localStorage.setItem('korisnikLogin', JSON.stringify(korisnikLogin));
        this.logger.debug('Token refresh: end');
      }));
  }

  private startRefreshTokenTimer() {
    const jwt: AuthJWTToken = this.jwtSubject.getValue();
    if (jwt != null) {
      // set a timeout to refresh the token a minute before it expires
      const expires = jwt.getExpiration(jwt.access_token)
      const timeout = expires.getTime() - Date.now() - (60 * 1000);

      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe();
        this.logger.debug('Token refresh by timer called');
      }, timeout);
      this.logger.debug('Token refresh by timer enabled: to refresh at ', expires);
    }
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
    this.logger.debug('Token refresh by timer disabled');
  }
}
