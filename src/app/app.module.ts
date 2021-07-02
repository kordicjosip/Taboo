import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {JwtInterceptor} from "@app/_helpers/jwt.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoggerModule, NGXLogger, NgxLoggerLevel} from "ngx-logger";
import {environment} from "@environments/environment";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {appInitializer} from "@app/_helpers/app.initializer";
import {ErrorInterceptor} from "@app/_helpers/error.interceptor";
import {NotFoundComponent} from './not-found/not-found.component';
import {HomeMobileComponent} from './home-mobile/home-mobile.component';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeMobileComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        LoggerModule.forRoot({
            level: environment.logLevel,
            serverLogLevel: NgxLoggerLevel.ERROR,
        }),
        ToastModule,
    ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [NGXLogger]},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
