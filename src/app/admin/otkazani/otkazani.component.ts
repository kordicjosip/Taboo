import {Component, OnInit} from '@angular/core';
import {Rezervacija} from "@app/_models/rezervacija";
import {MessageService} from "primeng/api";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {Dogadaj} from "@app/_models/dogadaj";

@Component({
  selector: 'app-otkazani',
  templateUrl: './otkazani.component.html',
  styleUrls: ['./otkazani.component.sass']
})
export class OtkazaniComponent implements OnInit {
  eventid: string | null;
  sveRezervacije: Rezervacija[];
  dogadaji: Dogadaj[];
  rezervacije: Rezervacija[];
  nazivdogadaja: string = "";
  filterIzraz: string = "";

  constructor(private messageService: MessageService,
              private rezervacijaService: RezervacijeService,
              private logger: NGXLogger,
              private activatedRoute: ActivatedRoute,
              private dogadajiService: DogadajiService) {
    this.rezervacije = [];
    this.sveRezervacije= [];
    this.dogadaji= [];
    this.eventid = activatedRoute.snapshot.paramMap.get("id");
  }


  ngOnInit(): void {
    //Pozivanje samo odbijenih rezervacija
    this.rezervacijaService.getRezervacijeByEvent(this.eventid!, 2 ).subscribe(rezervacije => {
      this.rezervacije = rezervacije;
      this.sveRezervacije= rezervacije;
      this.logger.debug(this.rezervacije);
    })
    this.dogadajiService.getDogadaji(false, true).subscribe(dogadaji => {
      this.dogadaji = dogadaji;
      this.logger.debug(this.dogadaji);
      if (this.eventid != null) {
        this.getDogadajById();
      }
    });
    this.logger.debug(`Vrijednost eventid je: ${this.eventid}`);
  }

  getDogadajById() {
    for (let dogadaj of this.dogadaji) {
      if (dogadaj.uid == this.eventid) {
        this.nazivdogadaja = dogadaj.naziv;
        this.logger.debug(`Pronađen dogadaj sa nazivom: ${this.nazivdogadaja}`);
        break;
      }

    }
  }
  PotvrdiRezervaciju(uid: string) {
    for (let rezervacija of this.rezervacije) {
      if (rezervacija.uid == uid) {
        this.rezervacijaService.confirmRezervacija(uid).subscribe(
          res => {
            rezervacija.status = res.status;
            this.alertSuccess("Uspješno ste potvrdili rezervaciju.");
          },
          error => {
            this.logger.error(`Greška prilikom poziva Potvrdi Rezervaciju`);
            this.alertError(error);
          }
        )
        break;
      }
    }
  }

  OtkaziRezervaciju(uid: string) {
    for (let rezervacija of this.rezervacije) {
      if (rezervacija.uid == uid) {
        this.rezervacijaService.cancelRezervacija(uid).subscribe(
          res => {
            rezervacija.status = res.status;
            this.alertSuccess("Uspješno ste otkazali rezervaciju.");
          },
          error => {
            this.logger.error(`Greška prilikom poziva OtkaziRezervaciju za rezervaciju`);
            this.alertError(error);
          }
        )

        break;
      }
    }
  }
  alertSuccess(message: string) {
    this.messageService.add({severity: 'success', key: "glavnitoast", summary: 'Uspješno!', detail: message});
  }

  alertError(message: string) {
    this.messageService.add({
      severity: 'error',
      key: "glavnitoast",
      summary: 'Greška!',
      detail: JSON.stringify(message)
    });
  }

  filtriraj(value: string) {
    this.filter(value);
  }

  filter(filter: string) {
    this.rezervacije = [];
    if (filter == '') {
      this.rezervacije = this.sveRezervacije;
    } else {
      for (const rezervacija of this.sveRezervacije) {
        const word = `${JSON.stringify(rezervacija.customer?.ime + " " + rezervacija.customer?.prezime).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
        const filteri = filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ');
        let includesAll = true;
        for (const i of filteri) {
          if (!word.includes(i)) {
            includesAll = false;
            break;
          }
        }
        if (includesAll) {
          this.rezervacije.push(rezervacija);
        }
      }
    }
  }

}
