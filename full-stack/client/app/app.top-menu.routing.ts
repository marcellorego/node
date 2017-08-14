import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { P404Component } from './404/404.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LoaderComponent } from './loader/loader.component';

const topMenuRoutes = [
    { path: '404', component: P404Component },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'crud', loadChildren: 'app/crud/crud.module#CrudModule' },
    {
        path: 'loader',
        component: LoaderComponent
    },
    {
        path: 'new',
        component: LoaderComponent,
        data: {
            componentName: 'CrudComponent',
            modulePath: 'app/crud/crud.module#CrudModule',
            api: 'tipoMidia'
        }
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contact List' }
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '404'
    }
];

export const AppTopMenuRouting: ModuleWithProviders = RouterModule.forRoot(topMenuRoutes,
    { enableTracing: false } // <-- debugging purposes only
);

/*{
    path: 'dropdown',
    component: DropdownComponent,
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
  },*/
