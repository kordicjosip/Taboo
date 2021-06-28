export interface DogadajInterface {
  id: string,
  title: string,
  date: string,
  description: string
}

export class Dogadaj {
  uid: string;
  datum: Date;
  naziv: string;
  opis: string;
  selected: boolean=false;
  alreadyReserved: boolean=false;

  constructor(res: DogadajInterface) {
    this.uid = res.id;
    this.datum = new Date(res.date);
    this.naziv = res.title;
    this.opis=res.description;
  }
}
