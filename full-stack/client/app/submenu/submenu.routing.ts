import { Routes } from '@angular/router';

import { SubmenuComponent } from './submenu.component';
import { Action1Component } from './action1/action1.component';
import { Action2Component } from './action2/action2.component';
import { CrudComponent } from '../crud/crud.component';

export const SubmenuRoutes: Routes = [
    { path: '', component: CrudComponent },
    {
    path: 'submenu',
    component: SubmenuComponent,
    children: [
        {
            path: 'action1',
            outlet: 'actions',
            data: { action: 'Action 1' },
            component: Action1Component
        },
        {
            path: 'action2',
            outlet: 'actions',
            data: { action: 'Action 2' },
            component: Action2Component
        }
    ]
  }
];
