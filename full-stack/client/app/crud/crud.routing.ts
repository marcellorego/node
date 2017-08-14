import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrudComponent } from './crud.component';

const routes: Routes = [
  { path: '', component: CrudComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
