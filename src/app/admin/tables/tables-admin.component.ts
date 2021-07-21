import {Component, OnInit, ViewChild} from '@angular/core';
import {Dogadaj} from "@app/_models/dogadaj";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {TablesComponent} from "@app/home/tables/tables.component";
import {Table, TableType, TableTypeMapping} from "@app/_models/table";
import {TableService} from "@app/_services/table.service";
import {MessageService} from "primeng/api";
import {NGXLogger} from "ngx-logger";

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
  tableTypes;
  selectedTableTypeValue:any;
  selectedEvent: string = "";
  napomena: string = "";

  defaultniDogadaj = new Dogadaj({
    id: "",
    title: "Zadani raspored stolova",
    date: "1970-01-01",
    description: ""
  })
  addTableVisible = false;
  addReservationVisible = false;
  newTableNumber: string = "";
  tableNumber: string = "";
  rotation: string = "0";


  constructor(
    private dogadajiService: DogadajiService,
    rezervacijeService: RezervacijeService,
    private tableService: TableService,
    private messageService: MessageService,
    private logger: NGXLogger) {
    this.rezervacijeService = rezervacijeService;
    this.tableTypes = TableTypeMapping;
    this.selectedTableTypeValue = this.tableTypes[1];
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = [this.defaultniDogadaj]
      for (const dogadaj of dogadaji)
        this.dogadaji.push(dogadaj);
    });
  }

  public get selectedTableType(): TableType {
    return this.selectedTableTypeValue ? this.selectedTableTypeValue.value: null;
  }

  showAddTable() {
    this.addTableVisible = true;
  }
  showAddReservation(){
    this.addReservationVisible = true;
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
      rotation: parseInt(this.rotation),
      status: 0,
      type: this.selectedTableTypeValue.value
    })
    this.tableService.createTable(newTable, eventId).subscribe(
      ()=>{
        this.alertSuccess();
      },
      error =>{
        this.logger.debug(JSON.stringify(error))
        this.alertError("Stol već postoji. ");
      }
    );
  }

  addReservation() {
    this.logger.debug(`Vrijednost tablenumbera je: ${this.tableNumber}`);
    this.logger.debug(`Vrijednost eventa  je: ${this.selectedEvent}`);
    this.logger.debug(`Vrijednost napomene je: ${this.napomena}`);
    this.rezervacijeService.createReservacija({
      table_number: parseInt(this.tableNumber),
      event: this.selectedEvent,
      message: this.napomena
    }).subscribe(
      rezervacij => {
        this.logger.debug("Uspješno kreirana rezervacija " + rezervacij.uid);
        this.alertSuccessMessage("Uspješno kreirana rezervacija");
      },
      error => {
        this.alertError(error);
        this.logger.error("Greška prilikom kreiranja rezervacije:" + JSON.stringify(error, null ,2));
      }
    )
  }

  alertSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Uspješno',
      key: "glavnitoast",
      detail: `Uspješno ste dodali novi stol. `
    });
  }

  alertSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Uspješno',
      key: "glavnitoast",
      detail: message
    });
  }

  alertError(message: string = "Greška u dodavanju.") {
    this.messageService.add({
      severity: 'error',
      summary: 'Greška',
      key: "glavnitoast",
      detail: `${JSON.stringify(message)}`
    });
  }

}
