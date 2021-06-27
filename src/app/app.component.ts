import {Component} from '@angular/core';
import {NotificationService} from "@app/_services/notification.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {TableService} from "@app/_services/table.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor(private notificationService: NotificationService, private reservationService: RezervacijeService, private tableService: TableService) {
  }
}
