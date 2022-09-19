import { EstatesComponent } from './views/estates/estates.component';
import { estatesRoutes } from './estates.routing';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    EstatesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(estatesRoutes),
    SharedModule
  ]
})
export class EstatesModule { }
