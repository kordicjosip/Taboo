import * as d3 from 'd3';
import {Dogadaj} from "@app/_models/dogadaj";

interface TableInterface {
  id: number;
  number: number;
  position_left: number;
  position_top: number;
  width: number;
  height: number;
  status: number;
}

enum TableStatus {
  Open = 0,
  Canceled = 1,
  Confirmed = 2,
  Disabled = 3
}

export class Table {
  id: number;
  number: number;
  x: number;
  y: number;
  width: number;
  height: number;
  status: TableStatus;

  // TODO ostala polja
  constructor(table: TableInterface) {
    this.id = table.id;
    this.number = table.number;
    this.x = table.position_left;
    this.y = table.position_top;
    this.width = table.width;
    this.height = table.height;

    switch (table.status) {
      case 0: {
        this.status = TableStatus.Open;
        break;
      }
      case 1: {
        this.status = TableStatus.Canceled;
        break;
      }
      case 2: {
        this.status = TableStatus.Confirmed;
        break;
      }
      case 3: {
        this.status = TableStatus.Disabled;
        break;
      }
      default: {
        this.status = TableStatus.Disabled;
      }
    }
  }
}

export class TableEventHolder {
  tables: Table[];
  event: Dogadaj | null;

  constructor(tables: Table[], event: Dogadaj | null) {
    this.tables = tables;
    this.event = event;
  }
}

interface TableReferenceInterface {
  g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  table: Table;
}

export class TableReference {
  g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  table: Table;

  constructor(table: TableReferenceInterface) {
    this.g = table.g;
    this.table = table.table;
  }
}
