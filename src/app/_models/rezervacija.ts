import {Dogadaj, DogadajInterface} from "@app/_models/dogadaj";
import {User, UserInterface} from "@app/_models/user";
import {Customer, CustomerInterface} from "@app/_models/customer";

interface RezervacijaInterface{
  id:number,
  table_number:number,
  date:string,
  customer:CustomerInterface,
  event:DogadajInterface,
  status:number
}

export class Rezervacija{
  uid:number;
  table_number:number;
  customer: Customer;
  date:Date;
  event: Dogadaj;
  status:number;


  constructor(res:RezervacijaInterface) {
    this.uid=res.id;
    this.table_number=res.table_number;
    this.customer=new Customer(res.customer);
    this.date=new Date(res.date);
    this.event=new Dogadaj(res.event);
    this.status=res.status;
  }
}
