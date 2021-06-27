import {Component} from '@angular/core';
import {UserService} from "@app/_services/user.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";

@Component({
  selector: 'app-rezervacija-registracija',
  templateUrl: './rezervacija-registracija.component.html',
  styleUrls: ['./rezervacija-registracija.component.sass']
})
export class RezervacijaRegistracijaComponent {
  ime: string = "";
  prezime: string = "";
  brojtelefona: string = "";
  napomena: string = "";

  rezervacijeService: RezervacijeService

  constructor(
    private userService: UserService,
    rezervacijeService: RezervacijeService,
    private router: Router,
    private authService: AuthService
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
        // TODO Prikazati unos ključa potvrde koda
        //  sa tim kodom pozvati smsConfirm
      }
    )
  }
}
