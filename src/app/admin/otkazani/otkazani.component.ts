import {Component, OnInit} from '@angular/core';
import {Rezervacija} from "@app/_models/rezervacija";
import {MessageService} from "primeng/api";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-otkazani',
  templateUrl: './otkazani.component.html',
  styleUrls: ['./otkazani.component.sass']
})
export class OtkazaniComponent implements OnInit {
  eventid: string | null;
  rezervacije: Rezervacija[];

  constructor(private messageService: MessageService,
              private rezervacijaService: RezervacijeService,
              private logger: NGXLogger,
              private activatedRoute: ActivatedRoute) {
    this.rezervacije = [];
    this.eventid = activatedRoute.snapshot.paramMap.get("id");
  }


  ngOnInit(): void {
    this.rezervacijaService.getRezervacijeByEvent(this.eventid!).subscribe(rezervacije => {
      this.rezervacije = rezervacije;
      this.logger.debug(this.rezervacije);
    })
  }

  PotvrdiRezervaciju(uid: string) {
    for (let rezervacija of this.rezervacije) {
      if (rezervacija.uid == uid) {
        this.rezervacijaService.confirmRezervacija(uid).subscribe(
          res => {
            rezervacija = res;
            this.logger.debug(`Potvrdi Rezervaciju pozvano za rezervaciju: ${rezervacija.uid}`)
          },
          error => {
            this.logger.error(`Greška prilikom poziva Potvrdi Rezervaciju`);
          }
        )
        this.messageService.add({
          severity: 'success',
          summary: 'Uspješno!',
          detail: 'Uspješno ste potvrdili rezervaciju!'
        });
        break;
      }
    }
  }

  OtkaziRezervaciju(uid: string) {
    for (let rezervacija of this.rezervacije) {
      if (rezervacija.uid == uid) {
        this.rezervacijaService.cancelRezervacija(uid).subscribe(
          res => {
            rezervacija = res;
            this.logger.debug(`Otkazi Rezervaciju pozvano za rezervaciju: ${rezervacija.uid}`);
          },
          error => {
            this.logger.error(`Greška prilikom poziva OtkaziRezervaciju za rezervaciju`)
          }
        )
        this.messageService.add({
          severity: 'success',
          summary: 'Uspješno!',
          detail: 'Uspješno ste otkazali rezervaciju!'
        });
        break;
      }
    }
  }

}
