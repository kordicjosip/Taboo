import {Component, OnInit} from '@angular/core';
import {UserService} from "@app/_services/user.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.sass'],
  providers: [ConfirmationService, MessageService]
})
export class RezervacijaComponent implements OnInit {
  ime: string = "";
  prezime: string = "";
  brojtelefona: string = "";
  napomena: string = "";
  smskey: string = "";

  constructor(
    private userService: UserService,
    private rezervacijeService: RezervacijeService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private logger: NGXLogger
  ) {
  }

  ngOnInit() {
    if (this.authService.smsAuthToken.getValue() != null) {
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
    this.rezervacijeService.ime.next(this.ime);
    this.rezervacijeService.prezime.next(this.prezime);
    this.rezervacijeService.brojtelefona.next(this.brojtelefona);
    this.rezervacijeService.napomena.next(this.napomena);

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
