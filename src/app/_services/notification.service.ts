import {Injectable, OnDestroy} from '@angular/core';
import {webSocket} from 'rxjs/webSocket'
import {environment} from "@environments/environment";
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private wsURL = `${environment.wsURL}notifications`;

  private socket$ = webSocket(this.wsURL);

  constructor(private logger: NGXLogger) {
    this.connect();
  }

  connect() {
    // TODO Authenticate if available
    this.socket$.subscribe(dataFromServer => {
        this.logger.debug(dataFromServer);
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
    this.socket$.next("Authenticate");
  }

  ngOnDestroy(): void {
    this.socket$.complete();
  }
}
