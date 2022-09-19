import { EstateFiltersComponent } from './../../../estate/views/estate-filters/estate-filters.component';
import { EstateQuickReportComponent } from './../../../estate/views/estate-quick-report/estate-quick-report.component';
import { Router } from '@angular/router';
import { EstateService } from './../../../core/services/estate/estate.service';
import { UsersStore } from './../../../core/stores/users/users.store';
import { IEstate } from './../../../core/models/estate.model';
import { Component, OnInit } from '@angular/core';
import { ServerTimestamp } from 'src/app/firebase';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-estates',
  templateUrl: './estates.component.html',
  styleUrls: ['./estates.component.scss'],
})
export class EstatesComponent implements OnInit {

  public loading = true;
  public estates: IEstate[] = [];

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private estateService: EstateService,
    private usersStore: UsersStore
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadEstates();
    console.log(this.estates);
  }

  public openEstate(id: string) {
    this.router.navigate([`/estate/${id}/dashboard`]);
  }

  public async markForSale(estate: IEstate): Promise<void> {
    await this.estateService.update(estate.id, !estate.activeSell);
    estate.activeSell = !estate.activeSell;
  }

  public async markAsSold(estate: IEstate): Promise<void> {
    await this.estateService.update(estate.id, !estate.sold);
    estate.sold = !estate.sold;
  }

  public async remove(id: string): Promise<void> {
    const loading = await this.loadingCtrl.create({ message: 'Изтриване на имот...' });
    loading.present();
    await this.estateService.delete(id);
    loading.dismiss();
    this.loading = true;
    this.loadEstates();
  }

  public async openFilters(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: EstateFiltersComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75, 1]
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  public async createEstate(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Създаване на нов имот...',
    });
    loading.present();

    const newEstate: IEstate = {
      id: null,
      title: null,
      description: null,
      address: null,
      area: 0,
      buyPrice: 0,
      soldPrice: 0,
      active: false,
      activeSell: false,
      sold: false,
      notary: null,
      houseManagerName: null,
      houseManagerPhone: null,
      createAt: ServerTimestamp(),
      createBy: this.usersStore.userId,
      updateAt: null,
      updateBy: null,
    }

    const estateEntry = await this.estateService.create(newEstate);
    loading.dismiss();
    this.router.navigate([`/estate/${estateEntry.id}/dashboard`]);
  }

  public async createReport(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: EstateQuickReportComponent,
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.25, 0.5, 0.75, 1]
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
  }

  private async loadEstates(): Promise<void> {
    this.estates = await this.estateService.getAll();
    this.loading = false;
  }

}
