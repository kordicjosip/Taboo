import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "@app/home/home.component";
import {DogadajiComponent} from './dogadaji/dogadaji.component';
import {RezervacijaComponent} from './rezervacija/rezervacija.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,

    children: [{
      path: '', component: DogadajiComponent,

    },
      {

        path: 'dogadaji/:id/rezervacija', component: RezervacijaComponent,

      },
      {
        path: 'dogadaji/:id', component: DogadajiComponent,
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
