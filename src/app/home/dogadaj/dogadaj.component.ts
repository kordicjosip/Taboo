import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {Dogadaj} from "@app/_models/dogadaj";

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

 //TODO Napraviti da se korisniku disablea događaj ako vec ima rezervaciju za taj dogadaj
  // TODO ili napraviti da mu piše VEC REZERVIRANO pored tog događaja (I U MOBILEU)

  constructor() {

  }

  ngOnInit(): void {
  }

  click() {

  }
}
