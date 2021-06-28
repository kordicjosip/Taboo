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
  providers: [MessageService]
})
export class DogadajiComponent implements OnInit {
  dogadaji: Dogadaj[] = [];
  korisnik: User | null = null;
  korisnikRezervacije: Rezervacija[] | null = null;
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
      this.rezervacijeService.selectedEvent.next(dogadaji[0])
    });
    this.korisnik=this.authService.korisnikSubject.getValue();
    if(this.korisnik!=null){
      this.userService.getUserDetails(this.korisnik.id).subscribe(
        kastomer => {
          this.logger.debug(`Fetchani podaci o korisniku sa id ${kastomer.id}`);
          this.korisnikRezervacije=kastomer.rezervacije;
        }
      )
    }
    for (let dogadaj of this.dogadaji){
      if(this.isAlreadyReserved(dogadaj))
        break; //TODO dodati parametar kao sto je sada "selected" u dogadajima i napraviti da ako ovdje isAlreadyReserved bude true za taj dogadaj staviti taj parametar true i da doda klasu koja ce disableati button i evenutalno promijeniti tekst(nadodati "Vec imate rezervaciju za ovaj dogadaj")
    }
  }

  isAlreadyReserved(dogadaj: Dogadaj): boolean {
    if(this.korisnikRezervacije!=null) {
      for (let rez of this.korisnikRezervacije) {
          if(rez.event.uid == dogadaj.uid)
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
