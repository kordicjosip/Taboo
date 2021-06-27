import {Component, Input, OnInit} from '@angular/core';
import {Rezervacija} from "@app/_models/rezervacija";
import {MessageService} from "primeng/api";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.sass'],
  providers: [MessageService]
})
export class RezervacijaComponent implements OnInit {
  eventid: string | null;
  rezervacije: Rezervacija[];
  constructor(private messageService: MessageService, private rezervacijaService: RezervacijeService, private logger: NGXLogger, private activatedRoute: ActivatedRoute) {
    this.rezervacije=[];
    this.eventid=activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.rezervacijaService.getRezervacijeByEvent(this.eventid!).subscribe(rezervacije => {
      this.rezervacije=rezervacije;
      this.logger.debug(this.rezervacije);
    })
  }
 //TODO napraviti da PotvrdiRezervaciju i OtkaziRezervaciju pozivaju PUT metode za updateanje polja "status" od rezervacije u bazi
  PotvrdiRezervaciju(uid: number) {
    for(let rezervacija of this.rezervacije){
      if(rezervacija.uid == uid){
        rezervacija.status=1;
        this.messageService.add({severity:'success', summary:'Uspješno!', detail:'Uspješno ste potvrdili rezervaciju!'});
        break;
      }
    }
  }

  OtkaziRezervaciju(uid: number) {
    for(let rezervacija of this.rezervacije){
      if(rezervacija.uid == uid){
        rezervacija.status=0;
        this.messageService.add({severity:'success', summary:'Uspješno!', detail:'Uspješno ste otkazali rezervaciju!'});
        break;
      }
    }
  }
}
