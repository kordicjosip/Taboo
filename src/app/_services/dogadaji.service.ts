import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AuthJWTToken} from "@app/_models/auth";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import { Dogadaj } from '@app/_models/dogadaj';


@Injectable({
  providedIn: 'root'
})
export class DogadajiService {


  // TODO podatci o korisniku
  // korisnikSubject: BehaviorSubject<any>;

  private refreshTokenTimeout: any;

  constructor(
    
    private http: HttpClient,
    private logger: NGXLogger
  ) {}

  getDogadaji(): Observable<Dogadaj[]> {
    return this.http.get<any>(`${environment.apiURL}/Events`).pipe(
      map((res: any[]) => {
        const dogadaji: Dogadaj[] = [];
        res.forEach((dogadaji: any) => {
          dogadaji.push(new Dogadaj(dogadaji));
        });
        return dogadaji;
      })
    );
  }
}

    
