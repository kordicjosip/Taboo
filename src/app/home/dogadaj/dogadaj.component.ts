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

  constructor() {

  }

  ngOnInit(): void {
  }

  click() {

  }
}
