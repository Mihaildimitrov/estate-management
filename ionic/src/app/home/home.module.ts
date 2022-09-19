import { DashboardComponent } from './views/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { HomeTabsComponent } from './views/home-tabs/home-tabs.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeRoutes } from './home.routing';



@NgModule({
  declarations: [
    HomeTabsComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    SharedModule
  ]
})
export class HomeModule { }
