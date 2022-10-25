import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAppComponent } from './views/admin-app/admin-app.component';
import { AdminLoginComponent } from './views/admin-login/admin-login.component';
import { UserAppComponent } from './views/user-app/user-app.component';

const routes: Routes = [
  {
    path: 'app',
    component: AdminAppComponent,
  },
  {
    path: 'admin-app',
    component: UserAppComponent,
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent,
  },
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
