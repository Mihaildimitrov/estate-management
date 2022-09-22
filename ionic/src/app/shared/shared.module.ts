import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MobxAngularModule } from 'mobx-angular';
import { ChartModule } from 'primeng/chart';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MobxAngularModule,
    RouterModule,
    SwiperModule,
    ChartModule
  ],
  exports: [
    IonicModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MobxAngularModule,
    RouterModule,
    SwiperModule,
    ChartModule
  ]
})
export class SharedModule { }
