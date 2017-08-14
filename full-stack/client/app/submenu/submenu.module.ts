import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// import { SlimLoadingBarService, SlimLoadingBarComponent } from 'ng2-slim-loading-bar';

import { SubmenuActionComponents } from './submenu.module.config';
import { SubmenuRoutes } from './submenu.routing';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule
  ],
  exports: [
    ...SubmenuActionComponents,
    SubmenuRoutes
  ],
  declarations: [
    ...SubmenuActionComponents
  ],
  providers: []
})
export class SubmenuModule {
  constructor() {}
}
