import {Component, OnInit} from '@angular/core';
import {Dogadaj} from "@app/_models/dogadaj";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {MessageService} from "primeng/api";
import {User} from "@app/_models/user";
import {Rezervacija} from "@app/_models/rezervacija";
import {UserService} from "@app/_services/user.service";
import {AuthService} from "@app/_services/auth.service";

@Component({
  selector: 'app-dogadaji-mobile',
  templateUrl: './dogadaji-mobile.component.html',
  styleUrls: ['./dogadaji-mobile.component.sass'],
})
export class DogadajiMobileComponent implements OnInit {

  dogadaji: Dogadaj[] = [];
  korisnik: User | null =null;
  korisnikRezervacije: Rezervacija[] = [];
  rezervacijeService: RezervacijeService

  constructor(private dogadajiService: DogadajiService,
              private router: Router,
              private logger: NGXLogger,
              rezervacijeService: RezervacijeService,
              private messageService: MessageService,
              private userService: UserService,
              private authService: AuthService) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = dogadaji;
      this.setReservedDogadaji();
      this.logger.debug(`Izabrani dogadaj je: ${this.rezervacijeService.selectedEvent.getValue()?.naziv}`)
    });
    this.authService.korisnikSubject.subscribe(
      korisnik => {
        this.korisnik = korisnik;
        if (korisnik != null) {
          this.korisnikRezervacije = korisnik.rezervacije;
          this.setReservedDogadaji();
        } else
          this.korisnikRezervacije = []

        this.logger.debug(`Provjera je li događaj rezerviran`)
        this.logger.debug(`Provjera vrijednosti korisnikRezervacija: ${this.korisnikRezervacije}`)
      }
    );
  }

  setReservedDogadaji() {
    for (let dogadaj of this.dogadaji) {
      if (this.isAlreadyReserved(dogadaj)) {
        dogadaj.alreadyReserved = true;
        this.logger.debug("Already reserved: " + dogadaj.uid)
      }
    }
    this.logger.debug(JSON.stringify(this.dogadaji, null, 2))
  }

  isAlreadyReserved(dogadaj: Dogadaj): boolean {
    if (this.korisnikRezervacije != null) {
      for (let rez of this.korisnikRezervacije) {
        if (rez.event.uid == dogadaj.uid) {
          dogadaj.tableNumber = rez.table_number;
          return true;
        }
      }
    }
    return false;
  }

  select(dogadaj: Dogadaj) {
    for (const i of this.dogadaji) {
      i.selected = i.uid == dogadaj.uid;
    }
  }

  next() {
    this.router.navigate(["/tables"]);
  }

  alert() {
    this.messageService.add({severity: 'danger', summary: 'Nemoguće nastaviti', detail: 'Niste odabrali događaj.'});
    this.logger.debug("Alert je trebao biti tu.")
  }
}
