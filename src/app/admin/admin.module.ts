import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from 'src/app/admin/admin.component';
import {TabMenuModule} from "primeng/tabmenu";
import {MenuModule} from 'primeng/menu';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {RezervacijaComponent} from './rezervacija/rezervacija.component';
import {DogadajiComponent} from './dogadaji/dogadaji.component';
import {LoginComponent} from './login/login.component';
import {FormsModule} from "@angular/forms";
import {OtkazaniComponent} from './otkazani/otkazani.component';
import {DogadajiotkazaniComponent} from './dogadajiotkazani/dogadajiotkazani.component';
import {TablesAdminComponent} from 'src/app/admin/tables/tables-admin.component';
import {HomeModule} from "@app/home/home.module";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";


@NgModule({
  declarations: [
    AdminComponent,
    RezervacijaComponent,
    DogadajiComponent,
    LoginComponent,
    OtkazaniComponent,
    DogadajiotkazaniComponent,
    TablesAdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TabMenuModule,
    MenuModule,
    TableModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    HomeModule,
    DialogModule,
    InputTextModule,
  ]
})
export class AdminModule {
}
