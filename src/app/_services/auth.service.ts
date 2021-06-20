import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AuthJWTToken} from "@app/_models/auth";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  korisnikLoginSubject: BehaviorSubject<AuthJWTToken | any>;

  constructor(
    private router: Router,
    private http: HttpClient,
    private logger: NGXLogger
  ) {
    const token = localStorage.getItem('jwt')
    if (token == null) {
      logger.debug('User not available')
      this.korisnikLoginSubject = new BehaviorSubject(null);
    } else {
      logger.debug('User needs to be validated')
      this.korisnikLoginSubject = new BehaviorSubject((JSON.parse(token)));
    }
  }
}
