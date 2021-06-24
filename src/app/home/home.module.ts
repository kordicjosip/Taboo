import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageComponent } from './page/page.component';
import { DogadajiComponent } from './dogadaji/dogadaji.component';
import { RezervacijaComponent } from './rezervacija/rezervacija.component';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';
import {InputTextModule} from "primeng/inputtext";
import {InputMaskModule} from 'primeng/inputmask';
import {FormsModule} from "@angular/forms";
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextareaModule} from "primeng/inputtextarea";



@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    PageComponent,
    DogadajiComponent,
    RezervacijaComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TabMenuModule,
    InputTextModule,
    InputMaskModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    InputTextareaModule


  ]
})
export class HomeModule {
}
