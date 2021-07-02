import {Component} from '@angular/core';
import {NotificationService} from "@app/_services/notification.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {TableService} from "@app/_services/table.service";
import {MessageService} from "primeng/api";
import {AuthService} from "@app/_services/auth.service";
import {UserService} from "@app/_services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor(private notificationService: NotificationService,
              private reservationService: RezervacijeService,
              private tableService: TableService,
              private messageService: MessageService,
              private authService: AuthService,
              private userService: UserService) {
    this.authService.jwtSubject.subscribe(token => {
        if (token != null && token.accessTokenIsValid()) {
          this.userService.getUserDetails('me').subscribe(
            user => this.authService.korisnikSubject.next(user)
          )
        }
      }
    )
  }
}
