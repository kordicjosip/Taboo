import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {MessageService} from 'primeng/api';
import {Table} from "@app/_models/table";
import {DogadajiService} from "@app/_services/dogadaji.service";
import {Dogadaj} from "@app/_models/dogadaj";
import {SMSAuth} from "@app/_models/auth";
import {UserService} from "@app/_services/user.service";
import {AuthService} from "@app/_services/auth.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  prijavljen: boolean = false;
  napomena: any;
  brojtelefona: any;
  prezime: any;
  ime: any;
  odabraniDogadaj: Dogadaj | null = null;
  table: Table | null = null;
  dogadaji: Dogadaj[] = [];

  registrationToken: string | null = null;

  constructor(private messageService: MessageService,
              private logger: NGXLogger,
              private dogadajiService: DogadajiService,
              private userService: UserService,
              private authService: AuthService) {
    this.logger.debug("Debug konstruktora");
  }

  addSingle() {
    this.messageService.add({severity: 'success', summary: 'Service Message', detail: 'Via MessageService'});
  }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(true).subscribe(dogadaji => {
      this.dogadaji = dogadaji;
      this.logger.debug(this.dogadaji);
      this.odabraniDogadaj = dogadaji[0];
    });
  }

  rezerviraj() {
    this.userService.registerAndReserve({
      phone_number: this.brojtelefona,
      ime: this.ime,
      prezime: this.prezime,
      event: this.odabraniDogadaj!.uid,
      table: this.table!.number
    }).subscribe(
      token => {
        this.registrationToken = token.token;
        // TODO Prikazati unos ključa potvrde koda
        //  sa tim kodom pozvati smsConfirm
      }
    )
  }

  smsConfirm(key: string) {
    if (this.registrationToken != null) {
      this.authService.confirmSMSAuth({
        token: this.registrationToken,
        key: key
      })
    }
  }
}
