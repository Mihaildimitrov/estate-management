import { EstateMaterialsComponent } from './views/estate-materials/estate-materials.component';
import { EstateServicesComponent } from './views/estate-services/estate-services.component';
import { EstateFeesComponent } from './views/estate-fees/estate-fees.component';
import { EstateDashboardComponent } from './views/estate-dashboard/estate-dashboard.component';
import { EstateTabsComponent } from './views/estate-tabs/estate-tabs.component';
import { Routes } from '@angular/router';

export const estateRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard1',
        pathMatch: 'full'
    },
    {
        path: 'dashboard1',
        component: EstateDashboardComponent
    },
    {
        path: '',
        component: EstateTabsComponent,
        children: [
            {
                path: 'dashboard',
                component: EstateDashboardComponent
            },
            {
                path: 'fees',
                component: EstateFeesComponent
            },
            {
                path: 'services',
                component: EstateServicesComponent
            },
            {
                path: 'materials',
                component: EstateMaterialsComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard1'
    }
];