import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {BehaviorSubject, Observable} from "rxjs";
import {Table, TableEventHolder} from "@app/_models/table";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {Dogadaj} from "@app/_models/dogadaj";

@Injectable({
  providedIn: 'root'
})
export class TableService {
  tablesSubject: BehaviorSubject<TableEventHolder[] | any>;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) {
    this.tablesSubject = new BehaviorSubject(null);
  }

  /** Učitava popis stolova u tablesSubject(po defaultu je null).
   * Moguće filtriranje po događaju putem eventId parametra */
  loadTables(event: Dogadaj | null = null): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}tables${event?.uid ? '?event_id=' + event.uid : ''}`)
      .pipe(map((resTables: any[]) => {
        this.logger.debug("Učitani stolovi za događaj id: " + event?.uid)
        const tables: Table[] = [];
        for (const resTable of resTables) {
          tables.push(new Table(resTable))
        }
        // TODO Držati event umjesto eventId
        this.tablesSubject.next(new TableEventHolder(tables, event));
      }));
  }
}
