import {Customer, CustomerInterface} from "@app/_models/customer";
import {Rezervacija, RezervacijaInterface} from "@app/_models/rezervacija";


export interface UserInterface {
  id: string;
  email: string | null;
  enabled: boolean;
  customer: CustomerInterface;
  reservations: RezervacijaInterface[];
  admin: boolean;
}

export class User{
  id:string;
  email:string | null;
  enabled: boolean;
  customer: Customer | null = null;
  rezervacije: Rezervacija[] = [];
  admin: boolean;

  constructor(res: UserInterface) {
    this.id = res.id;
    this.email = res.email;
    this.enabled = res.enabled;
    if (res.customer != null)
      this.customer = new Customer(res.customer);

    for (let rez of res.reservations) {
      this.rezervacije.push(new Rezervacija(rez));
    }
    this.admin = res.admin;
  }
}

export interface RegisterAndReserve {
  phone_number: string;
  ime: string;
  prezime: string;
  event: string;
  table: number;
  message: string;
}
