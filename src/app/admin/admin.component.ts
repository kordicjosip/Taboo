import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {Rezervacija} from "@app/_models/rezervacija";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {NgForOf, NgIf} from "@angular/common";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass'],
  providers: [MessageService]
})
export class AdminComponent implements OnInit {
  items: MenuItem[];
  rezervacije: Rezervacija[];
  constructor(rezervacijeService: RezervacijeService, private messageService: MessageService) {
    this.items=[];
    this.rezervacije=[];
  }

  ngOnInit(): void {
    this.items = [
      {label: 'Home', routerLink:'/admin' , icon: 'pi pi-fw pi-home', },
      {label: 'Rezervacije',routerLink:'/admin/dogadaji', icon: 'pi pi-fw pi-pencil'},
      {label: 'Otkazani', routerLink:'/admin/otkazani', icon:'pi pi-fw pi-trash'},
    ];

  }

  PotvrdiRezervaciju(uid: string) {
    for(let rezervacija of this.rezervacije){
      if(rezervacija.uid == uid){
        rezervacija.confirmed=true;
        this.messageService.add({severity:'success', summary:'Uspješno!', detail:'Uspješno ste potvrdili rezervaciju!'});
        break;
      }
    }
  }

  OtkaziRezervaciju(uid :string) {
    for(let rezervacija of this.rezervacije){
      if(rezervacija.uid == uid){
        rezervacija.confirmed=false;
        this.messageService.add({severity:'success', summary:'Uspješno!', detail:'Uspješno ste otkazali rezervaciju!'});
        break;
      }
    }
  }
}
