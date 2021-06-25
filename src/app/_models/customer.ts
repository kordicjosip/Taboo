import {User, UserInterface} from "@app/_models/user";

export interface CustomerInterface{
  user: UserInterface;
  phone_number:string;
  ime:string;
  prezime:string;
}

export class Customer {
  user: User;
  phone_number: string;
  ime:string;
  prezime:string;

  constructor(res: CustomerInterface) {
    this.user=new User(res.user);
    this.phone_number=res.phone_number;
    this.ime=res.ime;
    this.prezime=res.prezime;
  }
}
