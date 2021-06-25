export interface UserInterface {
  id:string;
  email:string | null;
  enabled: boolean;
}

export class User{
  id:string;
  email:string | null;
  enabled: boolean;

  constructor(res: UserInterface) {
    this.id=res.id;
    this.email=res.email;
    this.enabled=res.enabled;
  }
}
