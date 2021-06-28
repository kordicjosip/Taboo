import {Component, OnInit, ViewChild} from '@angular/core';
import {InputMask} from "primeng/inputmask";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {UserService} from "@app/_services/user.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";
import {Location} from "@angular/common";
import {User} from "@app/_models/user";

@Component({
  selector: 'app-forma-mobile',
  templateUrl: './forma-mobile.component.html',
  styleUrls: ['./forma-mobile.component.sass'],
  providers: [ConfirmationService, MessageService]
})
export class FormaMobileComponent implements OnInit {

  @ViewChild('sms')
  sms: InputMask | undefined;

  ime: string = "";
  prezime: string = "";
  brojtelefona: string = "";
  napomena: string = "";
  smskey: string = "";
  korisnik: User | null = null;

  rezervacijeService: RezervacijeService;

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
  }

  ngOnInit() {
    this.userService.getUserDetails().subscribe(
      (user: User) => {
        this.logger.debug("Fetched user: " + JSON.stringify(user));
        this.CustomerToValues(user.customer.ime, user.customer.prezime,user.customer.phone_number);
      }
    )
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

  //Kupljenje vrijednosti logiranog usera da bi ih prikazali odmah
  CustomerToValues(ime: string, prezime: string, brojtelefona: string){
    this.ime=ime;
    this.prezime=prezime;
    this.brojtelefona=brojtelefona;
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

  isImeEmpty() {
    return this.ime == "";
  }

  isPrezimeEmpty() {
    return this.prezime == "";
  }

//Viditi zasto ovdje cim jedno slovo unesemo odmah rezerviraj button postane available
  isBrojFull() {
    return this.brojtelefona.length == 15;
  }


  ProvjeriBroj() {
    this.logger.debug(`Vrijednost broja je: ${this.brojtelefona}`);
    this.logger.debug(`Veličina string broja je: ${this.brojtelefona.length}`);
    this.logger.debug(`Vrijednost isbrojfull je ${this.isBrojFull()}`)
  }

  back() {
    this._location.back();
  }

}
