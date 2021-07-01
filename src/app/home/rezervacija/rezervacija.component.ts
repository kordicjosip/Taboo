import {Component, OnInit} from '@angular/core';
import {UserService} from "@app/_services/user.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";
import {User} from "@app/_models/user";
import {Customer} from "@app/_models/customer";
import {Dogadaj} from "@app/_models/dogadaj";
import {Table} from "@app/_models/table";

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
  smskey: string = "";
  customer: Customer | null=null;
  selectedDogadaj: Dogadaj | null =null;
  selectedStol: Table | null = null;

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
    if(this.isLoggedIn()) {
      this.userService.getUserDetails().subscribe(
        (user: User) => {
          this.logger.debug("Fetched user: " + JSON.stringify(user));
          if (user.customer != null)
            this.CustomerToValues(user.customer.ime, user.customer.prezime, user.customer.phone_number);
        }
      )
    }
    //TODO vidit sta se ovdje dogodi kad user cancela klikom izvan boxa ili kad upre X gore desno
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

  //Kupljenje vrijednosti logiranog usera da bi ih prikazali odmah
  CustomerToValues(ime: string, prezime: string, brojtelefona: string){
    this.ime=ime;
    this.prezime=prezime;
    this.brojtelefona=brojtelefona;
  }

  rezerviraj() {
    //TODO napraviti da kad rezervira user, da mu odmah refresha dogadaje(tj da taj dogadaj za koji je rezervirao odmah dobije klasu alreadyReserved) ( SADA JE POTREBAN REFRESH)
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

          this.confirmationService.confirm({
            accept: () => {
              this.smsConfirm(this.smskey);
            },
            reject: () => {
              this.authService.smsAuthToken.next(null);
            }
          });
        },
        error => {
          this.alertError(error);
        }
      )
    }
  }

  smsConfirm(key: string) {
    if (this.authService.smsAuthToken.getValue() != null) {
      this.authService.confirmSMSAuth(key).subscribe(
        () => {
            this.logger.debug("Uspješna potvrda SMS-a.");
            this.alertSuccessMessage("Uspješno ste potvrdili SMS.");
        },
        error => {
          this.logger.debug("Neuspješna potvrda SMS-a. Neispravno unešen ključ.")
          this.alertError(error);
          //TODO ovdje prikazujem popup za confirm opet(Provjeri ovo Mate)
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

  alertSuccess(){
    this.messageService.add({severity: 'success',summary: 'Uspješno', key:"glavnitoast" ,detail: `Uspješno ste rezervirali na ime: ${this.ime + " " + this.prezime}`});
  }
  alertError(message: string = "Nepoznati error"){
    this.messageService.add({severity: 'error',summary: 'Greška', key:"glavnitoast" ,detail: `${JSON.stringify(message)}`});
  }
  alertSuccessMessage(message: string){
    this.messageService.add({severity: 'success',summary: 'Uspješno', key:"glavnitoast" ,detail: message});
  }

}
