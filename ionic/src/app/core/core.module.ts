import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule
  ],
  exports: [
    IonicModule,
    SwiperModule
  ]
})
export class CoreModule { }
