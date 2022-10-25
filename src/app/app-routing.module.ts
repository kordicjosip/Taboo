import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewComponent } from './views/admin-view/admin-view.component';
import { UserViewComponent } from './views/user-view/user-view.component';

const routes: Routes = [
  {
    path: 'app',
    component: UserViewComponent,
  },
  {
    path: 'admin-app',
    component: AdminViewComponent,
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
