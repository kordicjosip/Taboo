import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NGXLogger} from "ngx-logger";
import {BehaviorSubject} from "rxjs";
import {Table} from "@app/_models/table";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TableService {
  tablesSubject: BehaviorSubject<Table[] | any>;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) {
    this.tablesSubject = new BehaviorSubject(null);
    logger.debug("Loading tables");
    this.loadTablesForEvent();
  }

  loadTablesForEvent() {
    return this.http.get<any>(`${environment.apiURL}tables`, {withCredentials: false})
      .pipe(map((resTables: any[]) => {
        const tables: Table[] = [];
        for (const resTable of resTables) {
          tables.push(new Table(resTable))
        }
        this.tablesSubject.next(tables);
      }));
  }

}
