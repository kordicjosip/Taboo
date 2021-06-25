import { Component, OnInit } from '@angular/core';
import {Rezervacija} from "@app/_models/rezervacija";
import {MessageService} from "primeng/api";
import {RezervacijeService} from "@app/_services/rezervacije.service";

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.sass'],
  providers: [MessageService]
})
export class RezervacijaComponent implements OnInit {
  rezervacije: Rezervacija[];
  constructor(private messageService: MessageService, private rezervacijaService: RezervacijeService) {
    this.rezervacije=[];
  }

  ngOnInit(): void {
    this.rezervacije=[
      {uid:'1', status:1, confirmed:false, requestedfor:"nekad", requestedat:"nekad", korisnik:'Neki pajdo', },
      {uid:'2', status:1, confirmed:true, requestedfor:"nekad", requestedat:"nekad", korisnik:'Neki pajdo', },
      {uid:'3', status:1, confirmed:true, requestedfor:"nekad", requestedat:"nekad", korisnik:'Neki pajdo', },
      {uid:'4', status:1, confirmed:false, requestedfor:"nekad", requestedat:"nekad", korisnik:'Neki pajdo', },
      {uid:'5', status:1, confirmed:true, requestedfor:"nekad", requestedat:"nekad", korisnik:'Neki pajdo', }
    ]
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
