import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AuthJWTToken, Token} from "@app/_models/auth";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {User} from "@app/_models/user";
import {UserService} from "@app/_services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwt_token_key = 'jwt';
  jwtSubject = new BehaviorSubject<AuthJWTToken | null>(null);

  // TODO podatci o korisniku
  korisnikSubject = new BehaviorSubject<User | null>(null);
  smsAuthToken;
  private refreshTokenTimeout: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private logger: NGXLogger,
    private userService: UserService
  ) {
    const token = localStorage.getItem(this.jwt_token_key)
    const smsAuthToken = localStorage.getItem('smsAuthToken');
    if (smsAuthToken != null)
      this.smsAuthToken = new BehaviorSubject<Token | null>(JSON.parse(smsAuthToken));
    else this.smsAuthToken = new BehaviorSubject<Token | null>(null);

    this.smsAuthToken.subscribe(
      smsAuthToken => {
        if (smsAuthToken != null)
          localStorage.setItem('smsAuthToken', JSON.stringify(smsAuthToken))
        else
          localStorage.removeItem('smsAuthToken')

      }
    )
    if (token == null) {
      logger.debug('User not available')
      this.jwtSubject.next(null);
    } else {
      logger.debug('User needs to be validated')
      this.jwtSubject.next(new AuthJWTToken(JSON.parse(token)));
      if (this.jwtSubject.getValue() != null && this.jwtSubject.getValue()?.accessTokenIsValid()) {
        this.startRefreshTokenTimer();
      } else {
        this.refreshToken();
      }
    }
  }

  login(username: string, password: string, saveLogin: boolean) {
    this.http.post<any>(`${environment.apiURL}auth/login`, {username, password}, {withCredentials: false})
      .pipe(map(jwt => {
        // TODO Možda ovo prebaciti u metodu
        this.jwtSubject.next(new AuthJWTToken(jwt));
        if (saveLogin) {
          this.startRefreshTokenTimer();
          this.saveCredidentials(this.jwtSubject.getValue())
        }
        this.userService.getUserDetails().subscribe(
          (user: User) => {
            this.korisnikSubject.next(user);
          }
        );
      })).subscribe();
  }

  confirmSMSAuth(key: string) {
    // TODO U slučaju da nije uspjelo spremiti novi token
    const req = {
      key: key,
      token: this.smsAuthToken.getValue()?.token
    }
    this.http.post<any>(`${environment.apiURL}auth/sms/confirm`, req, {withCredentials: false})
      .pipe(map(jwt => {
        // TODO Možda ovo prebaciti u metodu
        this.jwtSubject.next(new AuthJWTToken(jwt));
        this.startRefreshTokenTimer();
        this.saveCredidentials(this.jwtSubject.getValue())

        this.userService.getUserDetails().subscribe(
          (user: User) => {
            this.korisnikSubject.next(user);
          }
        );
      })).subscribe();
  }

  saveCredidentials(token: AuthJWTToken | null) {
    this.logger.debug('Saving user credidentials');
    localStorage.setItem(this.jwt_token_key, JSON.stringify(token))
  }

  logout() {
    this.logger.debug('Logging out user');
    this.stopRefreshTokenTimer();
    localStorage.removeItem(this.jwt_token_key);
    this.jwtSubject.next(null);
  }

  /**
   * Osvježava token i kupi detalje o trenutnom korisniku
   */
  refreshToken() {
    this.logger.debug('Token refresh: start');
    const token: AuthJWTToken | null = this.jwtSubject.getValue();
    return this.http.post<any>(`${environment.apiURL}auth/refresh`, {refresh_token: token!.refresh_token}, {withCredentials: false})
      .pipe(map(korisnikLogin => {
        // TODO Možda ovo prebaciti u metodu
        this.jwtSubject.next(new AuthJWTToken(korisnikLogin));
        this.startRefreshTokenTimer();
        this.saveCredidentials(this.jwtSubject.getValue())
        this.logger.debug('Token refresh: end');

        this.userService.getUserDetails().subscribe(
          (user: User) => {
            this.korisnikSubject.next(user);
          }
        );
      }));
  }

  private startRefreshTokenTimer() {
    const jwt: AuthJWTToken | null = this.jwtSubject.getValue();
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
