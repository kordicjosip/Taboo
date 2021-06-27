import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeMobileRoutingModule } from './home-mobile-routing.module';
import { DogadajiMobileComponent } from './dogadaji-mobile/dogadaji-mobile.component';
import { DogadajMobileComponent } from './dogadaj-mobile/dogadaj-mobile.component';
import { TablesMobileComponent } from './tables-mobile/tables-mobile.component';
import {HomeModule} from "@app/home/home.module";
import { FormaMobileComponent } from './forma-mobile/forma-mobile.component';
import {TabMenuModule} from 'primeng/tabmenu';
import {InputTextModule} from "primeng/inputtext";
import {InputMaskModule} from 'primeng/inputmask';
import {FormsModule} from "@angular/forms";
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextareaModule} from "primeng/inputtextarea";
import {Ripple, RippleModule} from "primeng/ripple";
import {ConfirmDialogModule} from "primeng/confirmdialog";




@NgModule({
  declarations: [

    DogadajiMobileComponent,
    DogadajMobileComponent,
    TablesMobileComponent,
    FormaMobileComponent
  ],
  exports: [
    DogadajiMobileComponent
  ],
    imports: [
        CommonModule,
        HomeMobileRoutingModule,
        HomeModule,
        TabMenuModule,
        InputTextModule,
        InputMaskModule,
        FormsModule,
        ToastModule,
        ButtonModule,
        InputTextareaModule,
        RippleModule,
        ConfirmDialogModule
    ]
})
export class HomeMobileModule { }
