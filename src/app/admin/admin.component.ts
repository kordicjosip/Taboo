import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {Rezervacija} from "@app/_models/rezervacija";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {AuthService} from "@app/_services/auth.service";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";


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
              private authService: AuthService,
              private router: Router,
              private logger: NGXLogger) {
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
    if(!this.isLoggedInAdmin()) {
      this.router.navigate(["/admin/login"])
    }
  }

  isLoggedInAdmin() {
    return this.authService.jwtSubject.getValue() != null && this.authService.korisnikSubject.getValue()?.admin;
  }
}
