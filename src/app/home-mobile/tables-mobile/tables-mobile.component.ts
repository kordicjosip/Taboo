import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-tables-mobile',
  templateUrl: './tables-mobile.component.html',
  styleUrls: ['./tables-mobile.component.sass']
})
export class TablesMobileComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  next() {
    this.router.navigate(["/forma"]);
  }
}
