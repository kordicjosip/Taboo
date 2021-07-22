import {Component, OnInit, ViewChild} from '@angular/core';
import {InputMask} from "primeng/inputmask";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {UserService} from "@app/_services/user.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";
import {Location} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {Token} from "@app/_models/auth";

@Component({
  selector: 'app-forma-mobile',
  templateUrl: './forma-mobile.component.html',
  styleUrls: ['./forma-mobile.component.sass'],
  providers: [ConfirmationService]
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
  smsToken: Token | null = null;
  disableSMSDeny = true;

  constructor(
    private userService: UserService,
    rezervacijeService: RezervacijeService,
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private logger: NGXLogger,
    private _location: Location
  ) {
    this.rezervacijeService = rezervacijeService;

    this.authService.smsAuthToken.subscribe(token => {
        this.smsToken = token;
        if (this.smsToken != null)
          logger.debug("Got token: " + JSON.stringify(token));
        else
          logger.debug("smsToken is null")
      }
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
  CustomerToValues(ime: string, prezime: string, brojtelefona: string) {
    this.ime = ime;
    this.prezime = prezime;
    this.brojtelefona = brojtelefona;
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
          this.alertError(error.error.error);
          this.logger.error("Greška prilikom kreiranja rezervacije:" + JSON.stringify(error, null, 2));
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
          this.alertError(error.error.error);
        }
      )
    }
  }

  smsConfirm() {
    if (this.authService.smsAuthToken.getValue() != null) {
      this.authService.confirmSMSAuth(this.smskey).subscribe(
        () => {
          this.logger.debug("Uspješna potvrda SMS-a.");
          this.authService.smsAuthToken.next(null);
          this.alertSuccess();
        },
        (error: HttpErrorResponse) => {
          this.alertError(error.error.error);
        }
      )
    }
  }

  isLoggedIn() {
    return this.authService.jwtSubject.getValue() != null;
  }

  isImeEmpty() {
    return this.ime == "";
  }

  isPrezimeEmpty() {
    return this.prezime == "";
  }

  isAlreadyReserved(){
    return this.rezervacijeService.selectedEvent.getValue()?.alreadyReserved;
  }

  isBrojFull() {
    return this.brojtelefona.length >= 9;
  }
  isSmsKeyEmpty(){
    return this.smskey != undefined && this.smskey.length == 6;
  }


  back() {
    this._location.back();
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

  smsDeny() {
    this.authService.smsAuthToken.next(null);
    this.alertError("Probajte ponovno kreirati rezervaciju za 5 minuta. ");
  }

  smsDenyTimoutStart() {
    this.disableSMSDeny = true;
    setTimeout(() => {
      this.disableSMSDeny = false;
    }, 30000)
  }
}
