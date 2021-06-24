import {Component, OnInit} from '@angular/core';
import {AuthService} from "@app/_services/auth.service";

import{NotificationService} from "@app/_services/notification.service";
import {AuthJWTToken} from "@app/_models/auth";
import {NGXLogger} from "ngx-logger";
import {MessageService} from 'primeng/api';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {



  prijavljen:boolean=false;
  napomena: any;
  brojtelefona: any;
  prezime: any;
  ime: any;
  constructor(private messageService: MessageService, private logger:NGXLogger) {
    this.logger.debug("Debug konstruktora");


  }
  addSingle() {
    this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
  }

  ngOnInit(): void {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
    this.logger.debug("Debugamo");
  }

  Rezerviraj() {

  }

  OdaberiDogadaj() {

  }
}
