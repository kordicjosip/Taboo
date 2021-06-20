import {Injectable, OnDestroy} from '@angular/core';
import {webSocket} from 'rxjs/webSocket'
import {environment} from "@environments/environment";
import {NGXLogger} from "ngx-logger";
import {AuthService} from "@app/_services/auth.service";
import {AuthJWTToken} from "@app/_models/auth";

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private wsURL = `${environment.wsURL}notifications`;

  private socket$ = webSocket(this.wsURL);

  constructor(
    private logger: NGXLogger,
    private authService: AuthService) {
    this.connect();
  }

  connect() {
    this.socket$.subscribe(dataFromServer => {
        this.logger.debug(dataFromServer);
        // TODO if server asks for authentication then authenticate()
      },
      error => {
        this.logger.error(error);
        setTimeout(() => this.connect(), 1000);
      },
      () => {
        this.logger.debug('WebSocket Closed');
        setTimeout(() => this.connect(), 1000);
      }
    );
  }

  authenticate() {
    // TODO Authentication protocol definition
    const token: AuthJWTToken = this.authService.jwtSubject.getValue();
    if (token != null && token.accessTokenIsValid())
      this.socket$.next({access_token: token.access_token});
  }

  ngOnDestroy(): void {
    this.socket$.complete();
  }
}
