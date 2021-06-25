import {User, UserInterface} from "@app/_models/user";

interface AdminInterface{
  user: UserInterface;
}

export class Admin{
  user: User;

  constructor(res: AdminInterface) {
    this.user=new User(res.user);
  }
}
