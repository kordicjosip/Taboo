import {Component, Input, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {NGXLogger} from "ngx-logger";
import {Table, TableEventHolder, TableReference, TableShape, TableStatus} from "@app/_models/table";
import {TableService} from "@app/_services/table.service";
import {BehaviorSubject} from "rxjs";
import {Dogadaj} from "@app/_models/dogadaj";
import {RezervacijeService} from "@app/_services/rezervacije.service";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.sass']
})
export class TablesComponent implements OnInit {
  event: Dogadaj | null = null;
  /**
   * ako je admin=true prikazuje se kontrola za uredivanje stolova
   */
  @Input('admin')
  admin = false;

  private selectedTableSubject = new BehaviorSubject<Table | null>(null);
  private tablesHolder: d3.Selection<SVGGElement, unknown, HTMLElement, any> | undefined;
  private tableReferences = new Map<number, TableReference>();

  private trapezoidPoints = "-20,-30 -40,30 40,30 20,-30";
  private save: d3.Selection<any, unknown, HTMLElement, any> | null = null;

  constructor(
    private logger: NGXLogger,
    private tableService: TableService,
    private rezervacijeService: RezervacijeService
  ) {
    this.selectedTableSubject.subscribe(table => {
      this.rezervacijeService.selectedTable.next(table);
      logger.debug("Selected table number: " + table?.number)
    });
    this.rezervacijeService.selectedEvent.subscribe(
      event => {
        this.event = event;
        logger.debug("Selected event: " + event?.uid)
      }
    )
  }

  ngOnInit(): void {
    this.logger.debug("Initializing tables component");

    const svg = d3.select("div#tables")
      .append("svg")
      .attr("height", "100%")
      .attr("width", "100%");

    const fixedLayout = svg.append("g");

    if (this.admin) {
      // TODO ikona za spasiti
      this.save = fixedLayout.append('circle')
        .attr('cx', 'calc(100% - 50px)')
        .attr('cy', 'calc(100% - 50px)')
        .attr('r', 40)
        .attr('fill', '#00ff00')
        .attr('visibility', 'hidden')
        .on('click', function (d, _) {
          d3.select(this).transition()
            .duration(500)
            .attr('opacity', '.1');
        })
    }

    /*
    fixedLayout.append('rect')
      .attr('fill', 'rgba(0,0,0,0.01)')
      .attr('x', 0)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr('stroke', '#2378ae')
      .attr('stroke-dasharray', '10,5')
      .attr('stroke-linecap', 'butt')
      .attr('stroke-width', '3');
     */

    const g = svg.append("g");
    this.tablesHolder = g;
    if (!this.admin) {
      svg.call(d3.zoom<any, any>()
        .extent([[0, 0], [1200, 800]])
        .scaleExtent([0.5, 2])
        .on("zoom", function (event: any) {
          g.attr("transform", event.transform)
        }));
    }
    let imageHref = "assets/img/stolovi.png";
    if (this.admin) {
      imageHref = "assets/img/stolovi-inverted.png"
    }

    g.append('svg:image')
      .attr("xlink:href", imageHref)
      .attr('x', '200')
      .attr('y', '-150px')
      .attr('width', '1200px')
      .attr('height', '1200px')

    this.logger.debug("Initialized tables");

    // Ažuriranja stolova
    this.tableService.tablesSubject.subscribe(
      (tableEventHolder: TableEventHolder) => {
        if (tableEventHolder != null && this.event?.uid == tableEventHolder.event) {
          this.logger.debug("Ažuriranje stolova u tijeku");
          // Izmjenjene stolove uklanjamo i ponovo dodajemo, nove stolove samo dodajemo
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

          // One koji su uklonjeni uklanjamo
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
          this.logger.debug("Ažurirani stolovi");
        }
      });
  }

  addTable(table: Table) {
    this.logger.debug("Dodavanje stola: " + JSON.stringify(table));

    const selectedTableSubject = this.selectedTableSubject;
    const tableReferences = this.tableReferences;

    // Crtanje stola zavisno od oblika
    const g = this.tablesHolder!.append("g");
    let tableHolder: any;
    switch (table.shape) {
      case TableShape.CIRCLE:
        tableHolder = g.attr('transform', `translate(${table.x},${table.y})`)
          .append(table.shape)
          .attr('r', 25)
          .attr('fill', table.color);

        g.append('text')
          .text(table.number)
          .attr('x', 0)
          .attr('y', 5)
          .attr("text-anchor", "middle");
        break;
      case TableShape.RECT:
        tableHolder = g.attr('transform', `translate(${table.x},${table.y})`)
          .append(table.shape)
          .attr('x', -30)
          .attr('y', -30)
          .attr('width', 60)
          .attr('height', 60)
          .attr('fill', table.color);

        g.append('text')
          .text(table.number)
          .attr('x', 0)
          .attr('y', 5)
          .attr("text-anchor", "middle");
        break;
      case TableShape.TRAPEZOID:
        tableHolder = g.attr('transform', `translate(${table.x},${table.y})`)
          .append('polygon')
          .attr('points', this.trapezoidPoints)
          .attr('fill', table.color);

        g.append('text')
          .text(table.number)
          .attr('x', 0)
          .attr('y', 5)
          .attr("text-anchor", "middle");
        break;
    }

    // Funkcije stolova, on click, mouseover, etc.
    if (this.admin) {
      g.call(d3.drag<any, any>()
        .on("drag", function (event: any) {
          g.attr("transform", `translate(${event.x},${event.y})`);
          table.x = event.x;
          table.y = event.y;
        })
      )
      g.on('click', function () {
        const selectedTable = selectedTableSubject.getValue();
        if (selectedTable != null) {
          tableReferences.get(selectedTable.id)?.g.select(selectedTable.shape).attr('fill', selectedTable.color);

          // TODO prikazati management sučelje za uklanjanje
          // TODO sa drugog stola skinuti d3.drag i management sučelje

        }
        selectedTableSubject.next(table);
        tableHolder
          .transition()
          .duration(200)
          .attr('fill', 'rgb(24,255,0)');
      });
      /*
      let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style('position', 'absolute');

      g.on("mouseover", function (d, _) {
        div.transition()
          .duration(1000)
          .style("opacity", .9);
        div.html("TODO informacije o stolu, i izgled")
          .style("left", (d.pageX) + "px")
          .style("top", (d.pageY - 28) + "px");
      })
        .on("mouseout", function (d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
       */
    } else {
      g.on('click', function () {
        if (table.status == TableStatus.OPEN) {
          const selectedTable = selectedTableSubject.getValue();
          if (selectedTable != null) {
            tableReferences.get(selectedTable.id)?.g.select(selectedTable.shape).attr('fill', selectedTable.color);
          }
          selectedTableSubject.next(table);
          tableHolder
            .transition()
            .duration(200)
            .attr('fill', 'rgb(24,255,0)');
        }
      });
    }

    this.tableReferences.set(table.id, new TableReference({g, table}));
  }

  removeTable(table: Table) {
    this.logger.debug("Uklanjanje stola: " + JSON.stringify(table));
    const reference = this.tableReferences.get(table.id)!;
    reference.g.remove();
  }

  saveLayout() {
    for (const tableReference of this.tableReferences.values()) {
      this.tableService.updateTable(tableReference.table).subscribe();
    }
  }

  deleteSelected() {
    const tableToDelete = this.selectedTableSubject.getValue();
    if (tableToDelete != null) {
      this.removeTable(tableToDelete);
      this.tableService.deleteTable(tableToDelete).subscribe();
    }
  }
}
