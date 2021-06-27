import { Component, OnInit } from '@angular/core';
import {UserService} from "@app/_services/user.service";
import {RezervacijeService} from "@app/_services/rezervacije.service";
import {Router} from "@angular/router";
import {AuthService} from "@app/_services/auth.service";
import {User} from "@app/_models/user";

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.sass']
})
export class RezervacijaComponent implements OnInit {
  ime: string = "";
  prezime: string = "";
  brojtelefona: string = "";
  napomena: string = "";
  korisnik: User | null = null;

  rezervacijeService: RezervacijeService

  constructor(
    private userService: UserService,
    rezervacijeService: RezervacijeService,
    private router: Router,
    private authService: AuthService
  ) {
    this.rezervacijeService = rezervacijeService;
  }

  ngOnInit(): void {
    this.korisnik=this.authService.korisnikSubject.getValue();
    if(this.korisnik?.customer!=null){
      this.ime=this.korisnik.customer.ime;
      this.prezime=this.korisnik.customer.prezime;
      this.brojtelefona=this.korisnik.customer.phone_number;
    }
  }

  rezerviraj() {

  }
}
