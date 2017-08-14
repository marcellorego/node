import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SystemJsNgModuleLoader } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// import { SubmenuModule } from './submenu/submenu.module';

// Import PrimeNG modules
import { DataTableModule, InputTextareaModule, PanelModule, DropdownModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { AppConfigComponents, AppConfigDirectives, AppConfigPipes } from './app.module.config';
import { AppTopMenuRouting } from './app.top-menu.routing';

import { ApiModule } from './api/api.module';

@NgModule({
  declarations: [
    AppComponent,
    ...AppConfigComponents,
    ...AppConfigDirectives,
    ...AppConfigPipes
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppTopMenuRouting,
    DataTableModule,
    ApiModule
  ],
  providers: [SystemJsNgModuleLoader],
  bootstrap: [AppComponent]
})
export class AppModule { }
