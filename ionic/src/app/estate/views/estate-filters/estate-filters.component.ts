import { LoadingController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estate-filters',
  templateUrl: './estate-filters.component.html',
  styleUrls: ['./estate-filters.component.scss'],
})
export class EstateFiltersComponent implements OnInit {

  constructor(
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  public async save(): Promise<void> {
    // TODO: applay filters
  }

}
