import {Component, OnInit} from '@angular/core';
import {DogadajiService} from '@app/_services/dogadaji.service';
import {Dogadaj} from '@app/_models/dogadaj';
import {Router} from '@angular/router';
import {NGXLogger} from "ngx-logger";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {User} from "@app/_models/user";
import {AuthService} from "@app/_services/auth.service";
import {UserService} from "@app/_services/user.service";
import {MessageService} from "primeng/api";
import {Rezervacija} from "@app/_models/rezervacija";

@Component({
  selector: 'app-dogadaji',
  templateUrl: './dogadaji.component.html',
  styleUrls: ['./dogadaji.component.sass'],
})
export class DogadajiComponent implements OnInit {
  dogadaji: Dogadaj[] = [];
  korisnik: User | null = null;
  korisnikRezervacije: Rezervacija[] = [];
  rezervacijeService: RezervacijeService

  constructor(private dogadajiService: DogadajiService,
              private router: Router,
              private logger: NGXLogger,
              rezervacijeService: RezervacijeService,
              private authService: AuthService,
              private userService: UserService,
              private messageService: MessageService) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = dogadaji;
      this.setReservedDogadaji();
    });

    // Svaki put kad se promjeni korisnik pozvati će se slijedeće:
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
      }
    }
  }

  isAlreadyReserved(dogadaj: Dogadaj): boolean {
    if (this.korisnikRezervacije != null) {
      for (let rez of this.korisnikRezervacije) {
        if (rez.event.uid == dogadaj.uid)
          return true;
      }
    }
    return false;
  }

  select(dogadaj: Dogadaj) {
    for (const i of this.dogadaji) {
      i.selected = i.uid == dogadaj.uid;
    }
  }
}
