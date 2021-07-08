import {Component, OnInit} from '@angular/core';
import {UserService} from "@app/_services/user.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";
import {Token} from "@app/_models/auth";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.sass'],
  providers: [ConfirmationService]
})
export class RezervacijaComponent implements OnInit {
  ime: string = "";
  prezime: string = "";
  brojtelefona: string = "";
  napomena: string = "";
  smskey: any
  smsToken: Token | null = null;

  constructor(
    private userService: UserService,
    private rezervacijeService: RezervacijeService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private logger: NGXLogger
  ) {
    this.authService.smsAuthToken.subscribe(
      token => this.smsToken = token
    )
  }

  get showSmsDialog(): boolean {
    return this.smsToken != null
  }

  ngOnInit() {
    this.authService.korisnikSubject.subscribe(
      korisnik => {
        if (korisnik != null && korisnik.customer != null) {
          this.CustomerToValues(korisnik.customer.ime, korisnik.customer.prezime, korisnik.customer.phone_number);
        }
      }
    )
  }

  //Kupljenje vrijednosti logiranog usera da bi ih prikazali odmah
  CustomerToValues(ime: string, prezime: string, brojtelefona: string){
    this.ime=ime;
    this.prezime=prezime;
    this.brojtelefona=brojtelefona;
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
      }).subscribe(
        rezervacij => {
          this.logger.debug("Uspješno kreirana rezervacija " + rezervacij.uid);
          this.alertSuccess();
        },
        error => {
          this.alertError(error);
          this.logger.error("Greška prilikom kreiranja rezervacije:" + JSON.stringify(error, null ,2));
        }
      )
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
        },
        error => {
          this.alertError(error.error);
        }
      )
    }
  }

  smsConfirm() {
    if (this.authService.smsAuthToken.getValue() != null) {
      this.authService.confirmSMSAuth(this.smskey).subscribe(
        () => {
          this.logger.debug("Uspješna potvrda SMS-a.");
          this.alertSuccessMessage("Uspješno ste potvrdili SMS.");
          this.alertSuccess();
        },
        (error: HttpErrorResponse) => {
          this.alertError(error.error);
        }
      )
    }
  }

  isImeEmpty() {
    return this.ime == "";
  }

  isPrezimeEmpty() {
    return this.prezime == "";
  }

  isBrojFull() {
    return this.brojtelefona.length == 15 || this.brojtelefona.length == 16;
  }
  isDogadajEmpty(){
    return this.rezervacijeService.selectedEvent.getValue() == null;
  }
  isStolEmpty(){
    return this.rezervacijeService.selectedTable.getValue() == null;
  }
  isLoggedIn() {
    return this.authService.jwtSubject.getValue() != null;
  }

  alertSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Uspješno',
      key: "glavnitoast",
      detail: `Uspješno ste rezervirali stol sa brojem ${this.rezervacijeService.selectedTable.getValue()?.number} na ime: ${this.ime + " " + this.prezime}`
    });
  }

  alertError(message: string = "Nepoznati error") {
    this.messageService.add({
      severity: 'error',
      summary: 'Greška',
      key: "glavnitoast",
      detail: `${JSON.stringify(message)}`
    });
  }

  alertSuccessMessage(message: string) {
    this.messageService.add({severity: 'success', summary: 'Uspješno', key: "glavnitoast", detail: message});
  }

  smsDeny() {
    this.authService.smsAuthToken.next(null);
  }
}
