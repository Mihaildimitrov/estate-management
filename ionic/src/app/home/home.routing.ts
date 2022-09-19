import { HomeTabsComponent } from './views/home-tabs/home-tabs.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        component: HomeTabsComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'estates',
                loadChildren: () => import('./../estates/estates.module').then(m => m.EstatesModule),
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];