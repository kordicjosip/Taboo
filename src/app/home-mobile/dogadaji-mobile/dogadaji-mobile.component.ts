import { Component, OnInit } from '@angular/core';
import {Dogadaj} from "@app/_models/dogadaj";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-dogadaji-mobile',
  templateUrl: './dogadaji-mobile.component.html',
  styleUrls: ['./dogadaji-mobile.component.sass'],
  providers: [MessageService]
})
export class DogadajiMobileComponent implements OnInit {

  dogadaji: Dogadaj[] = [];

  rezervacijeService: RezervacijeService

  constructor(private dogadajiService: DogadajiService,
              private router: Router,
              private logger: NGXLogger,
              rezervacijeService: RezervacijeService,
              private messageService: MessageService) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = dogadaji;
      this.logger.debug(`Izabrani dogadaj je: ${this.rezervacijeService.selectedEvent.getValue()?.naziv}`)
    });
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
