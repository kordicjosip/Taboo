import {Customer, CustomerInterface} from "@app/_models/customer";

export interface UserInterface {
  id:string;
  email:string | null;
  enabled: boolean;
  customer: CustomerInterface
}

export class User{
  id:string;
  email:string | null;
  enabled: boolean;
  customer: Customer;

  constructor(res: UserInterface) {
    this.id=res.id;
    this.email=res.email;
    this.enabled=res.enabled;
    this.customer=new Customer(res.customer);
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
