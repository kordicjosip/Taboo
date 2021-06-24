import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from 'src/app/admin/admin.component';
import {TabMenuModule} from "primeng/tabmenu";
import {MenuModule} from 'primeng/menu';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import { RezervacijaComponent } from './rezervacija/rezervacija.component';
import { DogadajiComponent } from './dogadaji/dogadaji.component';




@NgModule({
  declarations: [
    AdminComponent,
    RezervacijaComponent,
    DogadajiComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TabMenuModule,
    MenuModule,
    TableModule,
    ButtonModule,
    ToastModule,

  ]
})
export class AdminModule {
}
