import { Component, OnInit } from '@angular/core';
import { DogadajiService } from '@app/_services/dogadaji.service';
import { Dogadaj } from '@app/_models/dogadaj';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dogadaji',
  templateUrl: './dogadaji.component.html',
  styleUrls: ['./dogadaji.component.sass']
})
export class DogadajiComponent implements OnInit {

  dogadaji: Dogadaj[]=[];
  constructor(private dogadajiService: DogadajiService, private router: Router) { }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji().subscribe(dogadaji=> this.dogadaji=dogadaji);
  }

  link(dogadaj: Dogadaj){
    this.router.navigate(['/dogadaji/' + dogadaj.id  +'/rezervacija'] )
  }

}
