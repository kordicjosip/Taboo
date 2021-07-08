import {Component, OnInit} from '@angular/core';
import {Dogadaj} from "@app/_models/dogadaj";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";

@Component({
  selector: 'app-tables-admin',
  templateUrl: './tables-admin.component.html',
  styleUrls: ['./tables-admin.component.sass']
})
export class TablesAdminComponent implements OnInit {
  dogadaji: Dogadaj[] = [];
  rezervacijeService: RezervacijeService;

  defaultniDogadaj = new Dogadaj({
    id: "",
    title: "Zadani raspored stolova",
    date: "",
    description: ""
  })

  constructor(
    private dogadajiService: DogadajiService,
    rezervacijeService: RezervacijeService) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = [this.defaultniDogadaj]
      for (const dogadaj of dogadaji)
        this.dogadaji.push(dogadaj);
    });
  }

}
