import {Component, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';
import {NGXLogger} from "ngx-logger";
import {Table, TableEventHolder, TableReference} from "@app/_models/table";
import {TableService} from "@app/_services/table.service";
import {BehaviorSubject} from "rxjs";
import {Dogadaj} from "@app/_models/dogadaj";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.sass']
})
export class TablesComponent implements OnInit, OnChanges {
  @Input('event')
  event: Dogadaj | null = null;
  @Output('selectedTable')
  selectedTable: Table | null = null;

  private selectedTableSubject = new BehaviorSubject<Table | null>(null);
  private tablesHolder: d3.Selection<SVGGElement, unknown, HTMLElement, any> | undefined;
  private tableReferences = new Map<number, TableReference>();

  constructor(
    private logger: NGXLogger,
    private tableService: TableService
  ) {
    this.selectedTableSubject.subscribe(table => this.selectedTable = table);

    tableService.loadTables(this.event).subscribe();
    tableService.tablesSubject.subscribe(
      (tableEventHolder: TableEventHolder) => {
        if (tableEventHolder != null && this.event == tableEventHolder.event) {
          for (const table of tableEventHolder.tables) {
            const originalTable = this.tableReferences.get(table.id)
            if (originalTable == undefined) {
              this.addTable(table);
            } else {
              if (originalTable.table != table) {
                this.removeTable(originalTable.table);
                this.addTable(table);
              }
            }
          }
          // TODO Optimizirati
          for (const insertedTable of this.tableReferences.entries()) {
            let remove = true;
            for (const table of tableEventHolder.tables) {
              if (insertedTable[0] == table.id) {
                remove = false;
              }
            }
            if (remove) {
              this.removeTable(this.tableReferences.get(insertedTable[0])!.table);
            }
          }
        }
      });
  }

  ngOnInit(): void {
    this.logger.debug("Initializing tables component");

    const svg = d3.select("div#tables")
      .append("svg")
      .attr("viewBox", "0 0 1200 800");

    const fixedLayout = svg.append("g");

    fixedLayout.append('circle')
      .attr('cx', 20)
      .attr('cy', 20)
      .attr('r', 15)
      .attr('fill', '#000')
      .on('mouseover', function (d, _) {
        d3.select(this).transition()
          .duration(500)
          .attr('opacity', '.1');
        console.log(d)
      })
      .on('mouseout', function (d, _) {
        d3.select(this).transition()
          .duration(500)
          .attr('opacity', '1');
        console.log(d)
      })

    fixedLayout.append('rect')
      .attr('fill', 'rgba(0,0,0,0.01)')
      .attr('x', 0)
      .attr("y", 0)
      .attr("width", 1200)
      .attr("height", 800)
      .attr('stroke', '#2378ae')
      .attr('stroke-dasharray', '10,5')
      .attr('stroke-linecap', 'butt')
      .attr('stroke-width', '3');


    const g = svg.append("g");
    this.tablesHolder = g;

    svg.call(d3.zoom<any, any>()
      .extent([[0, 0], [1200, 800]])
      .scaleExtent([0.25, 4])
      .on("zoom", function (event: any) {
        g.attr("transform", event.transform)
      }));

    this.logger.debug("Initialized tables");
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tableService.loadTables(this.event).subscribe();
  }

  addTable(table: Table) {
    this.logger.debug("Adding table: " + JSON.stringify(table));
    const logger = this.logger;
    const selectedTableSubject = this.selectedTableSubject;
    const tableReferences = this.tableReferences;

    const g = this.tablesHolder!.append("g");

    const circle = g.append('circle')
      .attr('cx', table.x)
      .attr('cy', table.y)
      .attr('r', 50)
      .attr('fill', 'rgba(105,163,178,1)');

    g.append('text')
      .text('Text')
      .attr('x', circle.node()!.getBBox().x + 35)
      .attr('y', circle.node()!.getBBox().y + 55);

    g.on('click', function () {
      const selectedTable = selectedTableSubject.getValue();
      if (selectedTable != null) {
        tableReferences.get(selectedTable.id)?.g.select('circle').attr('fill', 'rgba(105,163,178,1)');
      }
      logger.debug("Odabran stol: " + table.id);
      selectedTableSubject.next(table);
      // TODO Vratiti na boju koja odgovara tom statusu
      circle
        .transition()
        .duration(200)
        .attr('fill', 'rgba(48,255,49,0.72)');
    });

    this.tableReferences.set(table.id, new TableReference({g, table}));
  }

  removeTable(table: Table) {
    const reference = this.tableReferences.get(table.id)!;
    reference.g.remove();
  }
}
