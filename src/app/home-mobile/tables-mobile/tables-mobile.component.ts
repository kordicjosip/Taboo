import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {NGXLogger} from "ngx-logger";


@Component({
  selector: 'app-tables-mobile',
  templateUrl: './tables-mobile.component.html',
  styleUrls: ['./tables-mobile.component.sass']
})
export class TablesMobileComponent implements OnInit {
  rezervacijeService: RezervacijeService
  constructor(
    private router: Router,
    private _location: Location,
    rezervacijeService: RezervacijeService,
    private logger: NGXLogger
  ) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
    this.logger.debug(`Vrijednost selected stola je: ${this.rezervacijeService.selectedTable.getValue()}`)
  }

  next() {
    this.router.navigate(["/forma"]);
  }

  back() {
    this._location.back();
  }
}
