interface RezervacijaInterface{
  uid:string,
  korisnik:string,
  requestedat:string,
  requestedfor:string,
  confirmed:boolean,
  status:number
}

export class Rezervacija{
  uid:string;
  korisnik:string;
  requestedat:string;
  requestedfor:string;
  confirmed:boolean;
  status:number;

  constructor(res:RezervacijaInterface) {
    this.uid=res.uid;
    this.korisnik=res.korisnik;
    this.requestedat=res.requestedat;
    this.requestedfor=res.requestedfor;
    this.confirmed=res.confirmed;
    this.status=res.status;
  }
}
