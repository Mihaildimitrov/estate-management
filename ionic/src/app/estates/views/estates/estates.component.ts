import { UsersService } from 'src/app/core/services/users/users.service';
import { IUserEstate } from './../../../core/models/userEstate.model';
import { EstateFiltersComponent } from './../../../estate/views/estate-filters/estate-filters.component';
import { EstateQuickReportComponent } from './../../../estate/views/estate-quick-report/estate-quick-report.component';
import { NavigationEnd, Router } from '@angular/router';
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
    private usersService: UsersService,
    private estateService: EstateService,
    private usersStore: UsersStore
  ) {

    this.router.events.subscribe(async (e) => {
      if (e instanceof NavigationEnd) {
        const url = e.urlAfterRedirects;

        if (url === '/estates') {
          this.loading = true;
          await this.loadEstates();
        }
      }
    });

  }

  async ngOnInit(): Promise<void> {
    await this.loadEstates();
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
      notaryBuyTax: null,
      notarySellTax: null,
      brokerCommissionPercentages: 2.5,
      brokerBuyCommission: null,
      brokerSellCommission: null,
      createAt: ServerTimestamp(),
      createBy: this.usersStore.userId,
      updateAt: null,
      updateBy: null,
    };
    const estateEntry = await this.estateService.create(newEstate);

    const newUserEstate: IUserEstate = {
      id: null,
      userId: this.usersStore.userId,
      estateId: estateEntry.id,
      createAt: ServerTimestamp(),
      createBy: this.usersStore.userId,
      updateAt: null,
      updateBy: null
    };
    const userEstateEntry = await this.usersService.addUserToEstate(newUserEstate);
    this.loadEstates();

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
    this.estates = await this.estateService.getAllBasedOnUser(this.usersStore.userId);
    this.loading = false;
  }

}
