import { Component, OnInit } from '@angular/core';
import {Dogadaj} from "@app/_models/dogadaj";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-dogadaji-mobile',
  templateUrl: './dogadaji-mobile.component.html',
  styleUrls: ['./dogadaji-mobile.component.sass']
})
export class DogadajiMobileComponent implements OnInit {

  dogadaji: Dogadaj[] = [];

  rezervacijeService: RezervacijeService

  constructor(private dogadajiService: DogadajiService,
              private router: Router,
              private logger: NGXLogger,
              rezervacijeService: RezervacijeService) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = dogadaji;
      this.rezervacijeService.selectedEvent.next(dogadaji[0])
    });
  }

  link(dogadaj: Dogadaj) {
    this.router.navigate(['/dogadaji/' + dogadaj.uid + '/rezervacija'])
  }
  select(dogadaj: Dogadaj) {
    for (const i of this.dogadaji) {
      i.selected = i.uid == dogadaj.uid;
    }
  }

  next() {

  }
}
