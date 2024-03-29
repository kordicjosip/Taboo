import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { EventListComponent } from './events/components/event-list/event-list.component';
import { EventItemComponent } from './events/components/event-item/event-item.component';
import { EventViewComponent } from './events/components/event-view/event-view.component';
import { AdminAppComponent } from './views/admin-app/admin-app.component';
import { UserAppComponent } from './views/user-app/user-app.component';
import { MapViewComponent } from './map/components/map-view/map-view.component';
import { MapTableComponent } from './map/components/map-table/map-table.component';
import { ReservationsViewComponent } from './reservations/components/reservations-view/reservations-view.component';
import { ReservationsListComponent } from './reservations/components/reservations-list/reservations-list.component';
import { ReservationItemComponent } from './reservations/components/reservation-item/reservation-item.component';
import { UserCredentialsViewComponent } from './user-credentials/components/user-credentials-view/user-credentials-view.component';
import { AdminLoginComponent } from './views/admin-login/admin-login.component';

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventItemComponent,
    EventViewComponent,
    MapViewComponent,
    MapTableComponent,
    ReservationsViewComponent,
    ReservationsListComponent,
    ReservationItemComponent,
    UserCredentialsViewComponent,
    AdminLoginComponent,
    AdminAppComponent,
    UserAppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
