import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {BehaviorSubject} from "rxjs";
import {Table, TableEventHolder} from "@app/_models/table";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";

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
  loadTables(eventId: string | null = null): void {
    this.http.get<any>(`${environment.apiURL}tables${eventId ? '?event_id='+eventId : ''}`)
      .pipe(map((resTables: any[]) => {
        this.logger.debug("Učitani stolovi za događaj id: " + eventId)
        const tables: Table[] = [];
        for (const resTable of resTables) {
          tables.push(new Table(resTable))
        }
        // TODO Držati event umjesto eventId
        this.tablesSubject.next(new TableEventHolder(tables, eventId));
      }));
  }

}
