import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeMobileComponent} from "@app/home-mobile/home-mobile.component";
import {RezervacijaComponent} from "@app/home/rezervacija/rezervacija.component";
import {DogadajiMobileComponent} from "@app/home-mobile/dogadaji-mobile/dogadaji-mobile.component";
import {TablesMobileComponent} from "@app/home-mobile/tables-mobile/tables-mobile.component";
import {FormaMobileComponent} from "@app/home-mobile/forma-mobile/forma-mobile.component";

const routes: Routes = [
  {
    path:'', component: HomeMobileComponent,
    children: [
      {
        path: '', component: DogadajiMobileComponent,
      },
      {
        path:'tables', component: TablesMobileComponent
      },
      {
        path:'forma', component: FormaMobileComponent
      }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeMobileRoutingModule { }
