import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MobxAngularModule } from 'mobx-angular';


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
    SwiperModule
  ],
  exports: [
    IonicModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MobxAngularModule,
    RouterModule,
    SwiperModule
  ]
})
export class SharedModule { }
