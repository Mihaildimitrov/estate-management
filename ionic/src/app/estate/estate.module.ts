import { EstateDetailsComponent } from './views/estate-details/estate-details.component';
import { EstateFiltersComponent } from './views/estate-filters/estate-filters.component';
import { EstateQuickReportComponent } from './views/estate-quick-report/estate-quick-report.component';
import { EstateFeesComponent } from './views/estate-fees/estate-fees.component';
import { EstateServicesComponent } from './views/estate-services/estate-services.component';
import { EstateMaterialsComponent } from './views/estate-materials/estate-materials.component';
import { estateRoutes } from './estate.routing';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { EstateDashboardComponent } from './views/estate-dashboard/estate-dashboard.component';
import { EstateTabsComponent } from './views/estate-tabs/estate-tabs.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    EstateTabsComponent,
    EstateDashboardComponent,
    EstateFeesComponent,
    EstateServicesComponent,
    EstateMaterialsComponent,
    EstateQuickReportComponent,
    EstateFiltersComponent,
    EstateDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(estateRoutes),
    SharedModule
  ]
})
export class EstateModule { }
