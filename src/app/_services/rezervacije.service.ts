import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AuthJWTToken} from "@app/_models/auth";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import{Rezervacija} from "@app/_models/rezervacija";
import {Dogadaj} from "@app/_models/dogadaj";


@Injectable({
  providedIn: 'root'
})
export class RezervacijeService {




  private refreshTokenTimeout: any;

  constructor(

    private http: HttpClient,
    private logger: NGXLogger,

  ) {}

  getRezervacijeByEvent(uid: string): Observable<Rezervacija[]>{
    return this.http.get<any>(`${environment.apiURL}reservations/event/${uid}`).pipe(
      map((res: any[]) => {
        const rezervacije: Rezervacija[] = [];
        res.forEach((rezervacija: any) => {
          rezervacije.push(new Rezervacija(rezervacija));
        });
        this.logger.debug(JSON.stringify(rezervacije, null, 2));
        return rezervacije;
      })
    )
  }



}


