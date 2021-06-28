import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "@app/home/home.component";
import {RezervacijaComponent} from './rezervacija/rezervacija.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [

      {
        path: '', component: RezervacijaComponent,
      },
      {
        path: 'tables', component: RezervacijaComponent
      },
      {
        path:'forma', component: RezervacijaComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
