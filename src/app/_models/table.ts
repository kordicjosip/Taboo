import * as d3 from 'd3';

interface TableInterface {
  id: bigint;
  x: bigint;
  y: bigint;
  width: bigint;
  height: bigint;
}

export class Table {
  id: bigint;
  x: bigint;
  y: bigint;
  width: bigint;
  height: bigint;

  // TODO ostala polja
  constructor(table: TableInterface) {
    this.id = table.id;
    this.x = table.x;
    this.y = table.y;
    this.width = table.width;
    this.height = table.height;
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
