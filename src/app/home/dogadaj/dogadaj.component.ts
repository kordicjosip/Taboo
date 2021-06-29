import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {Dogadaj} from "@app/_models/dogadaj";
import {RezervacijeService} from "@app/_services/rezervacije.service";

@Component({
  selector: 'app-dogadaj',
  templateUrl: './dogadaj.component.html',
  styleUrls: ['./dogadaj.component.sass']
})
export class DogadajComponent implements OnInit {
  @Input('dogadaj')
  dogadaj: Dogadaj | undefined;

  @ViewChild('button')
  button: Button | null = null;

  @Input('selected')
  selected: boolean = false;

  @Input('alreadyReserved')
  alreadyReserved: boolean = false;

  rezervacijeService: RezervacijeService

  constructor(
    rezervacijeService: RezervacijeService
  ) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
  }

  click() {

  }
}
