import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from "@angular/platform-browser";
import {NotFoundComponent} from "@app/not-found/not-found.component";
import {AuthGuard} from "@app/_helpers/auth-guard.service";


const routes: Routes = [
  {
    path: '',
    loadChildren: () => {
      if (window.innerWidth > 768) {
        return import('./home/home.module').then(m => m.HomeModule)
      } else {
        return import('./home-mobile/home-mobile.module').then(m => m.HomeMobileModule)
      }
    }
  },
  {
    path: 'admin',
    loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule),
  },
  {path: '**', component: NotFoundComponent},

];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
