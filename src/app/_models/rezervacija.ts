import {Dogadaj, DogadajInterface} from "@app/_models/dogadaj";
import {Customer, CustomerInterface} from "@app/_models/customer";

export interface RezervacijaInterface {
  id: string,
  table_number: number,
  date: string,
  customer: CustomerInterface,
  event: DogadajInterface,
  status: number,
  message: string
}

export interface RezervacijaCreateInterface {
  table_number: number;
  event: string;
  message: string;
}

export enum RezervacijaStatusi {
  KREIRANA = 0,
  POTVRDENA = 1,
  ODBIJENA = 2,
}

export class RezervacijaStatus {
  naziv: string;
  vrijednost: RezervacijaStatusi;

  constructor(vrijednost: number) {
    this.vrijednost = vrijednost;

    switch (this.vrijednost) {
      case RezervacijaStatusi.KREIRANA: {
        this.naziv = 'Kreirana';
        break;
      }
      case RezervacijaStatusi.POTVRDENA: {
        this.naziv = 'Potvrđena';
        break;
      }
      case RezervacijaStatusi.ODBIJENA: {
        this.naziv = 'Odbijena';
        break;
      }
      default: {
        this.naziv = 'Nepoznati status';
        break;
      }
    }
  }
}

export class Rezervacija {
  uid: string;
  table_number: number;
  customer: Customer | null;
  date: Date;
  event: Dogadaj;
  status: RezervacijaStatus;
  napomena: string;

  constructor(res: RezervacijaInterface) {
    this.uid = res.id;
    this.table_number = res.table_number;
    if (res.customer != null)
      this.customer = new Customer(res.customer);
    else this.customer = null;
    this.date = new Date(res.date);
    this.event = new Dogadaj(res.event);
    this.status = new RezervacijaStatus(res.status);
    this.napomena = res.message;
  }
}
