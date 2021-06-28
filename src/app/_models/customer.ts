export interface CustomerInterface{
  phone_number:string;
  ime:string;
  prezime:string;
}

export class Customer {
  phone_number: string;
  ime:string;
  prezime:string;

  constructor(res: CustomerInterface) {
    this.phone_number=res.phone_number;
    this.ime=res.ime;
    this.prezime=res.prezime;
  }
}
