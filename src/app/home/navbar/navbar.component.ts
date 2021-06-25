import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[];
  activeItem: MenuItem;

  constructor() {
    this.items=[];
    this.activeItem=this.items[0];
  }

  ngOnInit(): void {
    this.items = [
      {label: 'POČETNA', id:'Pocetna'},
      {label: 'GALERIJA', id:'Galerija'},
      {label: 'TOP LOKACIJA', id:'Toplokacija'},
      {label: 'KONTAKTIRAJTE NAS', id:'Kontakt'},
      {label: 'ACCOUNT', id:'Account'}
    ];

    this.activeItem = this.items[0];
  }

}
