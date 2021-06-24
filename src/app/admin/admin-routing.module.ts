import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "@app/admin/admin.component";
import {RezervacijaComponent} from "@app/home/rezervacija/rezervacija.component";
import {DogadajiComponent} from "@app/home/dogadaji/dogadaji.component";

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [{
      path: 'dogadaji', component: DogadajiComponent
    },
      {

        path: 'dogadaji/:id/rezervacija', component: RezervacijaComponent,

      },
      {
        path: 'dogadaji/:id', component: DogadajiComponent,
      }

    ],


  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

}
