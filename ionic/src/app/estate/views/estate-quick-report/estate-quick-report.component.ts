import { ModalController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estate-quick-report',
  templateUrl: './estate-quick-report.component.html',
  styleUrls: ['./estate-quick-report.component.scss'],
})
export class EstateQuickReportComponent implements OnInit {

  constructor(
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  public async generate(): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Създаване на нов репорт...' });
    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

}
