import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Dogadaj} from "@app/_models/dogadaj";
import {Button} from "primeng/button";

@Component({
  selector: 'app-dogadaj-mobile',
  templateUrl: './dogadaj-mobile.component.html',
  styleUrls: ['./dogadaj-mobile.component.sass']
})
export class DogadajMobileComponent implements OnInit {

  @Input('dogadaj')
  dogadaj: Dogadaj | undefined;

  @ViewChild('button')
  button: Button | null = null;

  @Input('selected')
  selected: boolean = false;

  @Input('alreadyReserved')
  alreadyReserved: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
  }

  click() {

  }

}
