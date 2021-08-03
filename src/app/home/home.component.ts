import {Component} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {MessageService} from 'primeng/api';
import {Table} from "@app/_models/table";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {UserService} from "@app/_services/user.service";
import {AuthService} from "@app/_services/auth.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent {
  odabraniStol: Table | null = null;

  rezervacijeService: RezervacijeService

  constructor(private messageService: MessageService,
              private logger: NGXLogger,
              private dogadajiService: DogadajiService,
              private userService: UserService,
              private authService: AuthService,
              rezervacijeService: RezervacijeService) {
    this.rezervacijeService = rezervacijeService;
  }

  addSingle() {
    this.messageService.add({severity: 'success', key:"glavnitoast", summary: 'Service Message', detail: 'Via MessageService'});
  }


}
