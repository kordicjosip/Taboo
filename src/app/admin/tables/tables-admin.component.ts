import {Component, OnInit, ViewChild} from '@angular/core';
import {Dogadaj} from "@app/_models/dogadaj";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {TablesComponent} from "@app/home/tables/tables.component";
import {Table} from "@app/_models/table";
import {TableService} from "@app/_services/table.service";

@Component({
  selector: 'app-tables-admin',
  templateUrl: './tables-admin.component.html',
  styleUrls: ['./tables-admin.component.sass']
})
export class TablesAdminComponent implements OnInit {
  @ViewChild('tables')
  tables: TablesComponent | null = null;

  dogadaji: Dogadaj[] = [];
  rezervacijeService: RezervacijeService;

  defaultniDogadaj = new Dogadaj({
    id: "",
    title: "Zadani raspored stolova",
    date: "1970-01-01",
    description: ""
  })
  addTableVisible = false;
  newTableNumber: string = "";
  newTableType: string = "";

  constructor(
    private dogadajiService: DogadajiService,
    rezervacijeService: RezervacijeService,
    private tableService: TableService) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = [this.defaultniDogadaj]
      for (const dogadaj of dogadaji)
        this.dogadaji.push(dogadaj);
    });
  }

  showAddTable() {
    this.addTableVisible = true;
  }

  addTable() {
    let eventId = null;
    if (this.rezervacijeService.selectedEvent.getValue() != null) {
      eventId = this.rezervacijeService.selectedEvent.getValue()!.uid
    }
    const newTable = new Table({
      id: 0,
      number: parseInt(this.newTableNumber),
      position_left: 100,
      position_top: 100,
      rotation: 0,
      status: 0,
      type: parseInt(this.newTableType)
    })
    this.tableService.createTable(newTable, eventId).subscribe();
  }
}
