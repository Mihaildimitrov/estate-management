import { IFee } from './../../../core/models/fee.model';
import { ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/core/services/users/users.service';
import { EstateService } from './../../../core/services/estate/estate.service';
import { UsersStore } from './../../../core/stores/users/users.store';
import { EstateStore } from './../../../core/stores/estate/estate.store';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IEstate } from './../../../core/models/estate.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estate-details',
  templateUrl: './estate-details.component.html',
  styleUrls: ['./estate-details.component.scss'],
})
export class EstateDetailsComponent implements OnInit {

  public saveLoading = false;
  public form: FormGroup;


  public get estate(): IEstate {
    return this.estateStore.estate
  }


  public get buyPricePerSquare(): string {
    return Number(this.form.value.buyPrice / this.form.value.area).toFixed(2);
  }

  public get sellPricePerSquare(): string {
    return Number(this.form.value.soldPrice / this.form.value.area).toFixed(2);
  }

  constructor(
    private toastController: ToastController,
    private userService: UsersService,
    private estateService: EstateService,
    public usersStore: UsersStore,
    private estateStore: EstateStore
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(this.estate ? this.estate.title : null, [Validators.required]),
      description: new FormControl(this.estate ? this.estate.description : null, null),
      address: new FormControl(this.estate ? this.estate.address : null, null),
      area: new FormControl(this.estate ? this.estate.area : null, null),
      buyPrice: new FormControl(this.estate ? this.estate.buyPrice : null, null),
      soldPrice: new FormControl(this.estate ? this.estate.soldPrice : null, null),
      active: new FormControl(this.estate ? this.estate.active : null, null),
      activeSell: new FormControl(this.estate ? this.estate.activeSell : null, null),
      sold: new FormControl(this.estate ? this.estate.sold : null, null),
      notary: new FormControl(this.estate ? this.estate.notary : null, null),
      houseManagerName: new FormControl(this.estate ? this.estate.houseManagerName : null, null),
      houseManagerPhone: new FormControl(this.estate ? this.estate.houseManagerPhone : null, null),
      notaryBuy: new FormControl(this.estate ? this.estate.notaryBuyTax : null, null),
      brokerBuy: new FormControl(this.estate ? this.estate.brokerBuyCommission : null, null),
      brokerSell: new FormControl(this.estate ? this.estate.brokerSellCommission : null, null),
    });
  }

  ngOnDestroy(): void {
    this.form.reset();
  }

  public async save(): Promise<void> {
    if (this.form.valid) {
      this.saveLoading = true;
      const form = this.form.value;
      const estateBuyPriceInLeva = 1.95583 * form.buyPrice;
      const estateSellPriceInLeva = 1.95583 * form.soldPrice;

      const estatePayload: IEstate = {
        ... this.estate,
        title: form.title,
        description: form.description,
        address: form.address,
        area: form.area,
        buyPrice: form.buyPrice,
        soldPrice: form.soldPrice,
        active: form.active,
        activeSell: form.activeSell,
        sold: form.sold,
        notary: form.notary,
        houseManagerName: form.houseManagerName,
        houseManagerPhone: form.houseManagerPhone,
        notaryBuyTax: form.notaryBuy ? form.notaryBuy : Math.trunc((estateBuyPriceInLeva / 100) * 4.5),
        notarySellTax: Math.trunc((estateSellPriceInLeva / 100) * 4.5),
        brokerBuyCommission: form.brokerBuy ? form.brokerBuy : Math.trunc((estateBuyPriceInLeva / 100) * this.estate.brokerCommissionPercentages),
        brokerSellCommission: form.brokerSell ? form.brokerSell : Math.trunc((estateSellPriceInLeva / 100) * this.estate.brokerCommissionPercentages),
      }
      await this.estateService.update(this.estate.id, estatePayload);
      this.estateStore.setEstate(estatePayload);

      const feesDb = await this.estateService.getAllEstateFees(this.estate.id);
      const fees = this.getEstateMainFees().concat(feesDb);
      this.estateStore.setFees(fees);

      let totalFees = 0;
      fees.map(f => totalFees += f.cost);
      this.estateStore.setTotalFees(totalFees);

      this.saveLoading = false;
    }
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

}
