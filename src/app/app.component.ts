import {Component} from '@angular/core';
import {NotificationService} from "@app/_services/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor(private notificationService: NotificationService) {
  }
}
