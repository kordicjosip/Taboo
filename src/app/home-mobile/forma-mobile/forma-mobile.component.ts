import {Component, OnInit, ViewChild} from '@angular/core';
import {InputMask} from "primeng/inputmask";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {UserService} from "@app/_services/user.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-forma-mobile',
  templateUrl: './forma-mobile.component.html',
  styleUrls: ['./forma-mobile.component.sass']
})
export class FormaMobileComponent implements OnInit {

  @ViewChild('sms')
  sms: InputMask | undefined;

  ime: string = "";
  prezime: string = "";
  brojtelefona: string = "";
  napomena: string = "";
  smskey: string = "";

  rezervacijeService: RezervacijeService;

  constructor(
    private userService: UserService,
    rezervacijeService: RezervacijeService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private logger: NGXLogger
  ) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit() {
    if (this.authService.smsAuthToken.getValue() != null) {
      this.sms?.focus();
      this.confirmationService.confirm({
        accept: () => {
          this.smsConfirm(this.smskey);
        },
        reject: () => {
          this.authService.smsAuthToken.next(null);
        }
      });
    }
  }

  rezerviraj() {
    if (this.isLoggedIn()) {
      this.rezervacijeService.createReservacija({
        table_number: this.rezervacijeService.selectedTable.getValue()!.number,
        event: this.rezervacijeService.selectedEvent.getValue()!.uid,
        message: this.napomena

      })
    } else {
      this.userService.registerAndReserve({
        phone_number: this.rezervacijeService.brojtelefona.getValue()!,
        ime: this.rezervacijeService.ime.getValue()!,
        prezime: this.rezervacijeService.prezime.getValue()!,
        event: this.rezervacijeService.selectedEvent.getValue()!.uid,
        table: this.rezervacijeService.selectedTable.getValue()!.number,
        message: this.napomena
      }).subscribe(
        token => {
          this.authService.smsAuthToken.next(token);
          this.sms?.focus();

          this.confirmationService.confirm({
            accept: () => {
              this.smsConfirm(this.smskey);
            },
            reject: () => {
              this.authService.smsAuthToken.next(null);
            }
          });
        }
      )
    }
  }

  smsConfirm(key: string) {
    if (this.authService.smsAuthToken.getValue() != null) {
      this.authService.confirmSMSAuth(key);
    }
  }

  isLoggedIn() {
    return this.authService.jwtSubject.getValue() != null;
  }
}
