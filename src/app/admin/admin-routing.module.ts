import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "@app/admin/admin.component";

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [{
      path: '', component: AdminComponent,
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
