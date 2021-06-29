import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "@app/admin/admin.component";
import {RezervacijaComponent} from "@app/admin/rezervacija/rezervacija.component";
import {DogadajiComponent} from "@app/admin/dogadaji/dogadaji.component";
import {LoginComponent} from "@app/admin/login/login.component";
import {OtkazaniComponent} from "@app/admin/otkazani/otkazani.component";
import {DogadajiotkazaniComponent} from "@app/admin/dogadajiotkazani/dogadajiotkazani.component";

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [{
      path: 'dogadaji', component: DogadajiComponent
    },
      {
        path: 'dogadajiOtkazani', component: DogadajiotkazaniComponent
      },
      {

        path: 'dogadaji/:id/rezervacija', component: RezervacijaComponent,

      },
      {
        path: 'dogadaji/:id', component: DogadajiComponent,
      },
      {
        path: 'dogadaji/:id/otkazani', component: OtkazaniComponent
      },
      {
        path: 'login', component: LoginComponent
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
