import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from "@angular/platform-browser";
import {AuthGuard} from "@app/_helpers/auth-guard.service";
import {NotFoundComponent} from "@app/not-found/not-found.component";

const routes: Routes = [
  {path: '', loadChildren: () => import(`./home/home.module`).then(m => m.HomeModule)},
  {
    path: 'admin',
    loadChildren: () => import(`./admin/admin.module`).then(m => m.AdminModule),
    //canActivate: [AuthGuard]
  },
  {path: '**', component: NotFoundComponent}
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
