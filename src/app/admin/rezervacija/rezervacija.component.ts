import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Rezervacija} from "@app/_models/rezervacija";
import {MessageService} from "primeng/api";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute} from "@angular/router";
import {Dogadaj} from "@app/_models/dogadaj";
import {DogadajiService} from "@app/_services/dogadaji.service";

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.sass'],
})
export class RezervacijaComponent implements OnInit {
  eventid: string | null;
  sveRezervacije: Rezervacija[];
  dogadaji: Dogadaj[];
  rezervacije: Rezervacija[];
  nazivdogadaja: string="";
  filterIzraz: string="";

  constructor(private messageService: MessageService,
              private rezervacijaService: RezervacijeService,
              private logger: NGXLogger,
              private activatedRoute: ActivatedRoute,
              private dogadajiService: DogadajiService) {
    this.sveRezervacije=[];
    this.dogadaji=[];
    this.rezervacije=[];
    this.eventid=activatedRoute.snapshot.paramMap.get("id");
  }
  ngOnInit(): void {
    this.rezervacijaService.getRezervacijeByEvent(this.eventid!).subscribe(rezervacije => {
      this.sveRezervacije=rezervacije;
      this.rezervacije=rezervacije;
      this.logger.debug(this.sveRezervacije);
    });
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji=> {
      this.dogadaji=dogadaji;
      this.logger.debug(this.dogadaji);
      if(this.eventid!=null) {
        this.getDogadajById();
      }
    });
    this.logger.debug(`Vrijednost eventid je: ${this.eventid}`);

  }

  getDogadajById(){
    this.logger.debug("prva linija funkcije");
    for(let dogadaj of this.dogadaji){
      this.logger.debug(`Dogadaj ID: ${dogadaj.uid}`);
      this.logger.debug(`Event ID: ${this.eventid}`);
      if(dogadaj.uid == this.eventid){
        this.nazivdogadaja=dogadaj.naziv;
        this.logger.debug(`Pronađen dogadaj sa nazivom: ${this.nazivdogadaja}`);
        break;
      }

    }
  }
 //TODO Skontat s Matom zasto PotvrdiRezervaciju i OtkaziRezervaciju ne rade trenutno

  PotvrdiRezervaciju(uid: string) {
    for(let rezervacija of this.rezervacije){
      if(rezervacija.uid == uid){
        rezervacija.status=1;
        this.rezervacijaService.confirmRezervacija(uid).subscribe(
          rezervacij => {
            this.logger.debug(`Potvrdi Rezervaciju pozvano za rezervaciju: ${rezervacij.uid}`)
          },
          error => {
            this.logger.error(`Greška prilikom poziva Potvrdi Rezervaciju`);
          }
        )
        this.messageService.add({severity:'success', summary:'Uspješno!', detail:'Uspješno ste potvrdili rezervaciju!'});
        break;
      }
    }
  }

  OtkaziRezervaciju(uid: string) {
    for(let rezervacija of this.rezervacije){
      if(rezervacija.uid == uid){
        rezervacija.status=0;
        this.rezervacijaService.cancelRezervacija(uid).subscribe(
          rezervacij => {
            this.logger.debug(`Otkazi Rezervaciju pozvano za rezervaciju: ${rezervacij.uid}`);
          },
          error => {
            this.logger.error(`Greška prilikom poziva OtkaziRezervaciju za rezervaciju`)
          }
        )
        this.messageService.add({severity:'success', summary:'Uspješno!', detail:'Uspješno ste otkazali rezervaciju!'});
        break;
      }
    }
  }
  filtriraj(){
    setTimeout(() => {
      this.logger.debug("Trazim filter");
      this.filter(this.filterIzraz);
    })
  }
  filter(filter: string) {
    this.logger.debug(`Vrijednost filtera je: ${filter}`);
    this.rezervacije = [];
    if (filter == '') {
      this.rezervacije = this.sveRezervacije;
    } else {
      for (const rezervacija of this.sveRezervacije) {
        // TODO spasiti pretvaranje za ponovu upotrebu
        const word = `${JSON.stringify(rezervacija.customer.ime + " " + rezervacija.customer.prezime).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
        const filteri = filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ');
        let includesAll = true;
        for (const i of filteri) {
          if (!word.includes(i)) {
            includesAll = false;
            break;
          }
        }
        if (includesAll) {
          this.rezervacije.push(rezervacija);
        }
      }
    }
  }
}
