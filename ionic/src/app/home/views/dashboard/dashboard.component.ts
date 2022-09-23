import { EstateStore } from './../../../core/stores/estate/estate.store';
import { IFee } from './../../../core/models/fee.model';
import { UsersStore } from './../../../core/stores/users/users.store';
import { EstateService } from './../../../core/services/estate/estate.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { IEstate } from './../../../core/models/estate.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  public loading = true;

  public estates: IEstate[] = [];

  public totalProfit: number = 0;
  public totalInvested: number = 0;
  public totalFees: number = 0;
  public totalServices: number = 0;
  public totalMaterials: number = 0;


  public pieChartData;
  private totalBuy: number = 0;

  public totalSellProfit: number = 0;
  public totalSellInvested: number = 0;
  public totalSellFees: number = 0;
  public totalSellServices: number = 0;
  public totalSellMaterials: number = 0;

  public pieChartDataSell;
  private totalSellBuy: number = 0;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private usersService: UsersService,
    private estateService: EstateService,
    private estateStore: EstateStore,
    private usersStore: UsersStore
  ) {
    this.router.events.subscribe(async (e) => {
      if (e instanceof NavigationEnd) {
        const url = e.urlAfterRedirects;

        if (url === '/dashboard') {
          this.loading = true;
          console.log('LOAD...');
          this.loading = true;

          this.totalProfit = 0;
          this.totalInvested = 0;
          this.totalFees = 0;
          this.totalServices = 0;
          this.totalMaterials = 0;
          this.totalSellProfit = 0;
          this.totalSellInvested = 0;
          this.totalSellFees = 0;
          this.totalSellServices = 0;
          this.totalSellMaterials = 0;
          this.totalBuy = 0;
          this.totalSellBuy = 0;

          await this.load();
          this.loading = false;
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.load();
    this.loading = false;
  }

  private async load(): Promise<void> {
    this.estates = await this.estateService.getAllBasedOnUser(this.usersStore.userId);

    await Promise.all(this.estates.map(async estate => {

      if (estate.sold) this.totalSellBuy += (estate.buyPrice * 1.96);
      this.totalBuy += (estate.buyPrice * 1.96);

      // FEES:
      let estateTotalFees = 0;
      const feesDb = await this.estateService.getAllEstateFees(estate.id);
      const fees = this.getEstateMainFees(estate).concat(feesDb);
      fees.map(f => {
        if (estate.sold) this.totalSellFees += f.cost;
        this.totalFees += f.cost;
        estateTotalFees += f.cost;
      });

      // SERVICES:
      let estateTotalServices = 0;
      const services = await this.estateService.getAllEstateServices(estate.id);
      services.map(s => {
        if (estate.sold) this.totalSellServices += s.cost;
        this.totalServices += s.cost;
        estateTotalServices += s.cost;
      });

      // MATERIALS:
      let estateTotalMaterials = 0;
      const materials = await this.estateService.getAllEstateMaterials(estate.id);
      materials.map(m => {
        if (estate.sold) this.totalSellMaterials += m.cost;
        this.totalMaterials += m.cost;
        estateTotalMaterials += m.cost;
      });

      const estateTotalInvest = (estate.buyPrice * 1.96) + estateTotalFees + estateTotalMaterials + estateTotalServices;
      const estateProfit = (estate.soldPrice * 1.96) - estateTotalInvest;

      if (estate.sold) {
        this.totalSellInvested += estateTotalInvest;
        this.totalSellProfit += estateProfit;
      }
      this.totalInvested += estateTotalInvest;
      this.totalProfit += estateProfit;
    }));

    this.generatePieChartData();
  }

  private getEstateMainFees(estate: IEstate): IFee[] {
    return [
      {
        id: null,
        cost: estate.notaryBuyTax,
        description: 'Нотариус покупка',
        createAt: null,
        createBy: null,
        updateAt: null,
        updateBy: null,
      },
      {
        id: null,
        cost: estate.brokerBuyCommission,
        description: 'Брокер комисионна покупка',
        createAt: null,
        createBy: null,
        updateAt: null,
        updateBy: null,
      },
      {
        id: null,
        cost: estate.brokerSellCommission,
        description: 'Брокер комисионна продажба',
        createAt: null,
        createBy: null,
        updateAt: null,
        updateBy: null,
      }
    ];
  }

  private generatePieChartData() {
    this.pieChartData = {
      labels: ['Печалба', 'Покупка', 'Такси', 'Услуги', 'Материали'],
      datasets: [
        {
          data: [this.totalProfit, this.totalBuy, this.totalFees, this.totalServices, this.totalMaterials],
          backgroundColor: [
            "#264b24",
            "#141111",
            "#eb445a",
            "#50c8ff",
            "#fbb55b",
          ],
          hoverBackgroundColor: [
            "#264b24",
            "#141111",
            "#eb445a",
            "#50c8ff",
            "#fbb55b",
          ]
        }
      ]
    };

    this.pieChartDataSell = {
      labels: ['Печалба', 'Покупка', 'Такси', 'Услуги', 'Материали'],
      datasets: [
        {
          data: [this.totalSellProfit, this.totalSellBuy, this.totalSellFees, this.totalSellServices, this.totalSellMaterials],
          backgroundColor: [
            "#264b24",
            "#141111",
            "#eb445a",
            "#50c8ff",
            "#fbb55b",
          ],
          hoverBackgroundColor: [
            "#264b24",
            "#141111",
            "#eb445a",
            "#50c8ff",
            "#fbb55b",
          ]
        }
      ]
    };

  }

}
