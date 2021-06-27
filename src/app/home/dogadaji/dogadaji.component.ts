import {Component, OnInit} from '@angular/core';
import {DogadajiService} from '@app/_services/dogadaji.service';
import {Dogadaj} from '@app/_models/dogadaj';
import {Router} from '@angular/router';
import {NGXLogger} from "ngx-logger";
import {RezervacijeService} from "@app/_services/rezervacije.service";

@Component({
  selector: 'app-dogadaji',
  templateUrl: './dogadaji.component.html',
  styleUrls: ['./dogadaji.component.sass']
})
export class DogadajiComponent implements OnInit {
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
}
