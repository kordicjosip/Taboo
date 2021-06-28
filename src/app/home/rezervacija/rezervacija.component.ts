import {Component, OnInit} from '@angular/core';
import {UserService} from "@app/_services/user.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";
import {User} from "@app/_models/user";
import {Rezervacija} from "@app/_models/rezervacija";
import {Observable} from "rxjs";

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
  korisnik: User | null = null;

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
    this.korisnik=this.authService.korisnikSubject.getValue();
    if(this.korisnik?.customer!=null){
      this.ime=this.korisnik.customer.ime;
      this.prezime=this.korisnik.customer.prezime;
      this.brojtelefona=this.korisnik.customer.phone_number;
    }
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
 // TODO Napraviti success view za svaku uspješnu rezervaciju(i u mobileu)
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
          //TODO skontat sta cemo za success ovdje (Ili ostaviti usera na istom screenu sa popup porukom ili ga prebacit na kompletno drugu rutu)
          this.router.navigate(["/success"])
        },
        error => {
          this.logger.error("Greška prilikom kreiranja rezervacije:" + JSON.stringify(error, null ,2));
          this.messageService.add({severity: 'danger', summary: 'Greška', detail: 'Greška prilikom kreiranja rezervacije, pokušajte ponovno.'});
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
