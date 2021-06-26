import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {MessageService} from 'primeng/api';
import {Table} from "@app/_models/table";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {Dogadaj} from "@app/_models/dogadaj";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  prijavljen: boolean = false;
  napomena: any;
  brojtelefona: any;
  prezime: any;
  ime: any;
  odabraniDogadaj: Dogadaj | null = null;
  table: Table | null = null;
  dogadaji: Dogadaj[] = [];

  constructor(private messageService: MessageService, private logger: NGXLogger, private dogadajiService: DogadajiService) {
    this.logger.debug("Debug konstruktora");
  }

  addSingle() {
    this.messageService.add({severity: 'success', summary: 'Service Message', detail: 'Via MessageService'});
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = dogadaji;
      this.logger.debug(this.dogadaji);
      this.odabraniDogadaj = dogadaji[0];
    });
  }

  Rezerviraj() {

  }
}
