import {Component} from '@angular/core';
import {UserService} from "@app/_services/user.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-rezervacija-registracija',
  templateUrl: './rezervacija-registracija.component.html',
  styleUrls: ['./rezervacija-registracija.component.sass'],
  providers:[ConfirmationService, MessageService]
})
export class RezervacijaRegistracijaComponent {
  ime: string = "";
  prezime: string = "";
  brojtelefona: string = "";
  napomena: string = "";
  smskey: string= "";

  rezervacijeService: RezervacijeService

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

  rezerviraj() {
    this.userService.registerAndReserve({
      phone_number: this.rezervacijeService.brojtelefona.getValue()!,
      ime: this.rezervacijeService.ime.getValue()!,
      prezime: this.rezervacijeService.prezime.getValue()!,
      event: this.rezervacijeService.selectedEvent.getValue()!.uid,
      table: this.rezervacijeService.selectedTable.getValue()!.number
    }).subscribe(
      token => {
        this.authService.smsAuthToken.next(token);
        this.router.navigate(['/confirm']);
        this.confirmationService.confirm({
          accept: () => {
            let kljuc= (document.getElementById("smskljuc") as HTMLInputElement).value;
            this.smskey=kljuc;
            this.smsConfirm(this.smskey);
          }
        });
      }
    )
  }
  smsConfirm(key: string) {
    if (this.authService.smsAuthToken.getValue() != null) {
      this.authService.confirmSMSAuth(key);
    }
  }
  TestirajPopup() {
    this.confirmationService.confirm({
      accept: () => {
        let kljuc= (document.getElementById("smskljuc") as HTMLInputElement).value;
        this.smskey=kljuc;
        this.logger.debug(`Vrijednost smskeya je: ${this.smskey}`);
      }
    })
  }
}
