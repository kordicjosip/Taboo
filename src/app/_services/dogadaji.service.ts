import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {Dogadaj} from '@app/_models/dogadaj';


@Injectable({
  providedIn: 'root'
})
export class DogadajiService {

  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) {
  }

  getDogadaji(active: boolean = false): Observable<Dogadaj[]> {
    return this.http.get<any>(`${environment.apiURL}events`, {params: {active}}).pipe(
      map((res: any[]) => {
        const dogadaji: Dogadaj[] = [];
        res.forEach((dogadaj: any) => {
          dogadaji.push(new Dogadaj(dogadaj));
        });
        this.logger.debug(JSON.stringify(dogadaji, null, 2));
        return dogadaji;
      })
    );
  }
}


