import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {RegisterAndReserve, User} from "@app/_models/user";
import {Token} from "@app/_models/auth";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) {
  }

  getUserDetails(id: string = 'me'): Observable<User> {
    return this.http.get<User>(`${environment.apiURL}users/${id}`).pipe(
      map((res: any) => {
        const user = new User(res)
        this.logger.debug(JSON.stringify(user, null, 2));
        return user;
      })
    );
  }

  registerAndReserve(req: RegisterAndReserve): Observable<Token> {
    return this.http.post<Token>(`${environment.apiURL}users/customers/register-reserve`, req, {withCredentials: false}).pipe(
      map((res: Token) => {
        this.logger.debug("Got token: " + res.token);
        return res;
      })
    );
  }
}


