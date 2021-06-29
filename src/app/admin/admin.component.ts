import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {Rezervacija} from "@app/_models/rezervacija";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {NgForOf, NgIf} from "@angular/common";
import {NgForm} from "@angular/forms";
import {AuthService} from "@app/_services/auth.service";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass'],
})
export class AdminComponent implements OnInit {
  items: MenuItem[];
  rezervacije: Rezervacija[];
  activeItem: MenuItem;
  constructor(rezervacijeService: RezervacijeService,
              private messageService: MessageService,
              private authService: AuthService) {
    this.items=[];
    this.rezervacije=[];
    this.activeItem=this.items[0];
  }

  ngOnInit(): void {
    this.items = [
      {label: 'Home', routerLink:'/admin/dogadaji' , icon: 'pi pi-fw pi-home', },
      {label: 'Rezervacije',routerLink:'/admin/dogadaji', icon: 'pi pi-fw pi-pencil'},
      {label: 'Otkazani', routerLink:'/admin/dogadajiOtkazani', icon:'pi pi-fw pi-trash'},
    ];
    this.activeItem=this.items[0];

  }

 //TODO staviti ovdje da provjerava je li role admin isto
  isLoggedInAdmin() {
    return this.authService.jwtSubject.getValue() != null;
  }
}
