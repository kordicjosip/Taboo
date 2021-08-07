import {Component, OnInit} from '@angular/core';
import {DogadajiService} from '@app/_services/dogadaji.service';
import {Dogadaj} from '@app/_models/dogadaj';
import {Router} from '@angular/router';
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-dogadaji',
  templateUrl: './dogadaji.component.html',
  styleUrls: ['./dogadaji.component.sass']
})
export class DogadajiComponent implements OnInit {

  dogadaji: Dogadaj[] = [];
  constructor(private dogadajiService: DogadajiService, private router: Router, private logger: NGXLogger) { }

  ngOnInit(): void {
    this.dogadajiService.getDogadaji(false, true).subscribe(dogadaji => {
      this.dogadaji = dogadaji;
      this.logger.debug(this.dogadaji);
    });
  }

  link(dogadaj: Dogadaj){
    this.router.navigate(['admin/dogadaji/' + dogadaj.uid  +'/rezervacija'] )
  }
}
