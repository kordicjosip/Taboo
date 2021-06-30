import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {environment} from "@environments/environment";
import {catchError, map} from "rxjs/operators";
import {Rezervacija, RezervacijaCreateInterface} from "@app/_models/rezervacija";
import {Table} from "@app/_models/table";
import {Dogadaj} from "@app/_models/dogadaj";


@Injectable({
  providedIn: 'root'
})
export class RezervacijeService {
  selectedTable = new BehaviorSubject<Table | null>(null);
  selectedEvent = new BehaviorSubject<Dogadaj | null>(null);
  ime = new BehaviorSubject<string | null>(null);
  prezime = new BehaviorSubject<string | null>(null);
  brojtelefona = new BehaviorSubject<string | null>(null);
  napomena = new BehaviorSubject<string | null>(null);


  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
  ) {
  }

  createReservacija(req: RezervacijaCreateInterface): Observable<Rezervacija> {
    return this.http.post(`${environment.apiURL}reservations`, req).pipe(
      map((res: any) => {
        return new Rezervacija(res);
      })
    )
  }

  getRezervacijeByEvent(uid: string): Observable<Rezervacija[]> {
    return this.http.get<any>(`${environment.apiURL}reservations/events/${uid}`).pipe(
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
  confirmRezervacija(uid: string): Observable<Rezervacija>{
    return this.http.post(`${environment.apiURL}reservations/${uid}/confirm`, {}).pipe(
      map((res: any) =>{
        return new Rezervacija(res);
      })
    )
  }
  cancelRezervacija(uid: string): Observable<Rezervacija>{
    return this.http.post(`${environment.apiURL}reservations/${uid}/cancel`, {}).pipe(
      map((res: any) =>{
        return new Rezervacija(res);
      })
    )
  }
  //TODO dodati endpoint koji ce dobavljati samo otkazane rezervacije po eventid

}


