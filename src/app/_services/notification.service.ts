import {Injectable, OnDestroy} from '@angular/core';
import {webSocket} from 'rxjs/webSocket'
import {environment} from "@environments/environment";
import {NGXLogger} from "ngx-logger";
import {AuthService} from "@app/_services/auth.service";
import {AuthJWTToken} from "@app/_models/auth";
import {Notification} from "@app/_models/notification";
import {TableService} from "@app/_services/table.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private wsURL = `${environment.wsURL}notifications`;

  private socket$ = webSocket(this.wsURL);

  constructor(
    private logger: NGXLogger,
    private authService: AuthService,
    private tableService: TableService,
    private rezervacijeService: RezervacijeService) {

    if (authService.korisnikSubject.getValue()?.admin) {
      this.wsURL = this.wsURL + '-admin'
      this.socket$ = webSocket(this.wsURL);
    }

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
        switch (message.message_type) {
          case 'auth_request': {
            this.authenticate();
            break;
          }
          case 'table_reservation': {
            this.tableService.loadTables(message.message.event_id).subscribe();
            if (this.authService.korisnikSubject.getValue()?.admin) {
              this.rezervacijeService.getRezervacijeByEvent(message.message.event_id).subscribe();
            }
            break;
          }
          case 'table_new_layout': {
            this.tableService.loadTables(message.message.event_id).subscribe();
            break;
          }
          default: {
            this.logger.error("websocket message unknown");
            break;
          }
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
    const token: AuthJWTToken | null = this.authService.jwtSubject.getValue();
    if (token != null && token.accessTokenIsValid()) {
      this.socket$.next({access_token: token.access_token});
    }
  }

  ngOnDestroy(): void {
    this.socket$.complete();
  }
}
