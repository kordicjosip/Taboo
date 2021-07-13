import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {BehaviorSubject, Observable} from "rxjs";
import {Table, TableEventHolder, TableInterface} from "@app/_models/table";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {RezervacijeService} from "@app/_services/rezervacije.service";

@Injectable({
  providedIn: 'root'
})
export class TableService {
  tablesSubject: BehaviorSubject<TableEventHolder[] | any>;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
    private rezervacijeService: RezervacijeService
  ) {
    this.tablesSubject = new BehaviorSubject(null);
    rezervacijeService.selectedEvent.subscribe(
      event => {
        if (event != null) {
          logger.debug("Učitavanje stolova za događaj: " + event?.uid)
          this.loadTables(event.uid).subscribe();
        } else
          logger.debug("Potrebno ručno pozivanje loadTables za event null")
      }
    )
  }

  /** Učitava popis stolova u tablesSubject(po defaultu je null).
   * Moguće filtriranje po događaju putem eventId parametra */
  loadTables(event: string | null): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}tables${event ? '?event_id=' + event : ''}`)
      .pipe(map((resTables: any[]) => {
        this.logger.debug("Učitani stolovi za događaj id: " + event)
        const tables: Table[] = [];
        for (const resTable of resTables) {
          tables.push(new Table(resTable))
        }
        this.tablesSubject.next(new TableEventHolder(tables, event));
      }));
  }

  /** Ažuriranje stola */
  updateTable(table: Table): Observable<any> {
    const req: TableInterface = {
      id: table.id,
      number: table.number,
      position_left: table.x,
      position_top: table.y,
      rotation: table.rotation,
      status: table.status,
      type: table.type
    }

    return this.http.put<any>(`${environment.apiURL}tables/${table.id}`, req);
  }

  /** Stvaranje novog stola */
  createTable(table: Table, event_id: string | null = null): Observable<any> {
    const req: TableInterface | any = {
      id: table.id,
      number: table.number,
      position_left: table.x,
      position_top: table.y,
      rotation: table.rotation,
      status: table.status,
      type: table.type
    }
    if (event_id == "")
      req.event_id = null;
    else
      req.event_id = event_id;

    return this.http.post<any>(`${environment.apiURL}tables`, req);
  }

  /** Brisanje stola */
  deleteTable(table: Table): Observable<any> {
    return this.http.delete<any>(`${environment.apiURL}tables/${table.id}`);
  }
}
