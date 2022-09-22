import { IMaterial } from './../../../core/models/material.models';
import { IService } from './../../../core/models/service.model';
import { IFee } from './../../../core/models/fee.model';
import { EstateStore } from './../../../core/stores/estate/estate.store';
import { IEstate } from './../../../core/models/estate.model';
import { EstateService } from './../../../core/services/estate/estate.service';
import { ToastController } from '@ionic/angular';
import { UsersStore } from './../../../core/stores/users/users.store';
import { UsersService } from './../../../core/services/users/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-estate-dashboard',
  templateUrl: './estate-dashboard.component.html',
  styleUrls: ['./estate-dashboard.component.scss'],
})
export class EstateDashboardComponent implements OnInit {

  public loading = true;
  public pieChartData: any;


  public get estate(): IEstate {
    return this.estateStore.estate
  }


  public get totalInvested(): number {
    return (this.estate.buyPrice * 1.96) + this.totalFees + this.totalMaterials + this.totalServices;
  }


  public get totalProfit(): number {
    return (this.estate.soldPrice * 1.96) - this.totalInvested;
  }


  public get fees(): IFee[] {
    return this.estateStore.fees;
  }

  public get totalFees(): number {
    return this.estateStore.totalFees;
  }

  public get services(): IService[] {
    return this.estateStore.services;
  }

  public get totalServices(): number {
    return this.estateStore.totalServices;
  }

  public get materials(): IMaterial[] {
    return this.estateStore.materials;
  }

  public get totalMaterials(): number {
    return this.estateStore.totalMaterials;
  }


  constructor(
    private toastController: ToastController,
    private userService: UsersService,
    private estateService: EstateService,
    public usersStore: UsersStore,
    private estateStore: EstateStore
  ) { }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadFees(), this.loadMaterials(), this.loadServices()]);
    this.generatePieChartData();
    this.loading = false;
  }

  ngOnDestroy(): void {
  }

  private async loadFees(): Promise<void> {
    const feesDb = await this.estateService.getAllEstateFees(this.estate.id);
    const fees = this.getEstateMainFees().concat(feesDb);
    this.estateStore.setFees(fees);

    let totalFees = 0;
    fees.map(f => totalFees += f.cost);
    this.estateStore.setTotalFees(totalFees);
  }

  private getEstateMainFees(): IFee[] {
    return [
      {
        id: null,
        cost: this.estate.notaryBuyTax,
        description: 'Нотариус покупка',
        createAt: null,
        createBy: null,
        updateAt: null,
        updateBy: null,
      },
      {
        id: null,
        cost: this.estate.brokerBuyCommission,
        description: 'Брокер комисионна покупка',
        createAt: null,
        createBy: null,
        updateAt: null,
        updateBy: null,
      },
      {
        id: null,
        cost: this.estate.brokerSellCommission,
        description: 'Брокер комисионна продажба',
        createAt: null,
        createBy: null,
        updateAt: null,
        updateBy: null,
      }
    ];
  }

  private async loadMaterials(): Promise<void> {
    const materials = await this.estateService.getAllEstateMaterials(this.estate.id);
    this.estateStore.setMaterials(materials);

    let totalMaterials = 0;
    materials.map(m => totalMaterials += m.cost);
    this.estateStore.setTotalMaterials(totalMaterials);

  }

  private async loadServices() {
    const services = await this.estateService.getAllEstateServices(this.estate.id);
    this.estateStore.setServices(services);

    let totalServices = 0;
    services.map(m => totalServices += m.cost);
    this.estateStore.setTotalServices(totalServices);
  }

  private generatePieChartData() {
    this.pieChartData = {
      labels: ['Покупка', 'Такси', 'Услуги', 'Материали'],
      datasets: [
        {
          data: [(this.estate.buyPrice * 1.96), this.totalFees, this.totalServices, this.totalMaterials],
          backgroundColor: [
            "#141111",
            "#eb445a",
            "#50c8ff",
            "#fbb55b",
          ],
          hoverBackgroundColor: [
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
