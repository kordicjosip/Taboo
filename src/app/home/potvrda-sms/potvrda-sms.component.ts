import {Component, OnInit} from '@angular/core';
import {AuthService} from "@app/_services/auth.service";

@Component({
  selector: 'app-potvrda-sms',
  templateUrl: './potvrda-sms.component.html',
  styleUrls: ['./potvrda-sms.component.sass']
})
export class PotvrdaSmsComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  smsConfirm(key: string) {
    if (this.authService.smsAuthToken.getValue() != null) {
      this.authService.confirmSMSAuth(key);
    }
  }
}
