import { EstateNotesComponent } from './../estate-notes/estate-notes.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estate-tabs',
  templateUrl: './estate-tabs.component.html',
  styleUrls: ['./estate-tabs.component.scss'],
})
export class EstateTabsComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  public async openNotes() {
    const modal = await this.modalCtrl.create({
      component: EstateNotesComponent,
      initialBreakpoint: 1,
      breakpoints: [0, 0.25, 0.5, 0.75, 1]
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

}
