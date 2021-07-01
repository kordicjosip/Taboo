import {Component, OnInit} from '@angular/core';
import {Rezervacija} from "@app/_models/rezervacija";
import {MessageService} from "primeng/api";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";
import {DogadajiService} from "@app/_services/dogadaji.service";

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.sass'],
})
export class RezervacijaComponent implements OnInit {
  eventid: string | null;
  rezervacijeForEvent: Rezervacija[] = [];
  rezervacije: Rezervacija[];
  nazivdogadaja: string = "";
  filterIzraz: string = "";

  constructor(private messageService: MessageService,
              private rezervacijaService: RezervacijeService,
              private logger: NGXLogger,
              private activatedRoute: ActivatedRoute) {
    this.rezervacije = [];
    this.eventid = activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.rezervacijaService.getRezervacijeByEvent(this.eventid!).subscribe(() => {
      this.rezervacijaService.rezervacijeEvent.get(this.eventid!!)!!.subscribe(
        (rezervacije: Rezervacija[]) => {
          this.logger.debug("Nova rezervacija")
          this.rezervacijeForEvent = rezervacije;
          this.filter(this.filterIzraz);
        }
      );
    });
    this.logger.debug(`Vrijednost eventid je: ${this.eventid}`);
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

  filterEvent(value: string) {
    this.filter(value);
  }

  filter(filter: string) {
    this.rezervacije = [];
    if (filter == '') {
      this.rezervacije = this.rezervacijeForEvent;
    } else {
      for (const rezervacija of this.rezervacijeForEvent) {
        const word = `${JSON.stringify(rezervacija.customer.ime + " " + rezervacija.customer.prezime).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
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
