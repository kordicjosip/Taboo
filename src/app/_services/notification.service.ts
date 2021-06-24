import {Injectable, OnDestroy} from '@angular/core';
import {webSocket} from 'rxjs/webSocket'
import {environment} from "@environments/environment";
import {NGXLogger} from "ngx-logger";
import {AuthService} from "@app/_services/auth.service";
import {AuthJWTToken} from "@app/_models/auth";
import {Notification} from "@app/_models/notification";

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

    authService.jwtSubject.subscribe(
      () => {
        this.authenticate();
      }
    )
  }

  connect() {
    this.socket$.subscribe((dataFromServer: any) => {
        const message = new Notification(dataFromServer);
        this.logger.debug(JSON.stringify(message, null, 2));
        if (message.message_type == 'auth_request') {
          this.authenticate();
        }

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
    const token: AuthJWTToken = this.authService.jwtSubject.getValue();
    if (token != null && token.accessTokenIsValid())
      this.socket$.next({access_token: token.access_token});
  }

  ngOnDestroy(): void {
    this.socket$.complete();
  }
}
