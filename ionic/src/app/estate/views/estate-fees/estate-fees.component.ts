import { IFee } from './../../../core/models/fee.model';
import { ServerTimestamp } from 'src/app/firebase';
import { IEstate } from './../../../core/models/estate.model';
import { ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/core/services/users/users.service';
import { EstateService } from './../../../core/services/estate/estate.service';
import { UsersStore } from './../../../core/stores/users/users.store';
import { EstateStore } from './../../../core/stores/estate/estate.store';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { parseToMoment } from '../../../shared/helpers/moment';

@Component({
  selector: 'app-estate-fees',
  templateUrl: './estate-fees.component.html',
  styleUrls: ['./estate-fees.component.scss'],
})
export class EstateFeesComponent implements OnInit {

  public feesLoading = true;
  public saveLoading = false;
  public form: FormGroup;

  public get estate(): IEstate {
    return this.estateStore.estate
  }

  public get fees(): IFee[] {
    return this.estateStore.fees;
  }

  constructor(
    private toastController: ToastController,
    private userService: UsersService,
    private estateService: EstateService,
    public usersStore: UsersStore,
    public estateStore: EstateStore
  ) { }

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      cost: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required])
    });

    if (!this.fees.length) {
      await this.loadFees();
    } else {
      this.feesLoading = false;
    }
  }

  public async edit(fee: IFee): Promise<void> { }

  public async remove(id: string): Promise<void> { }

  public async save(): Promise<void> {
    if (this.form.valid) {
      this.saveLoading = true;
      const feePayload: IFee = {
        id: null,
        cost: this.form.value.cost,
        description: this.form.value.description,
        createAt: ServerTimestamp(),
        createBy: this.usersStore.userId,
        updateAt: null,
        updateBy: null,
      };

      await this.estateService.addFee(this.estate.id, feePayload);
      this.form.reset();
      this.saveLoading = false;
      this.feesLoading = true;
      this.loadFees();
    }
  }

  private async loadFees() {
    const feesDb = await this.estateService.getAllEstateFees(this.estate.id);
    feesDb.map(f => f.dateAdded = parseToMoment(f.createAt).format('DD.MM'));
    const fees = this.getEstateMainFees().concat(feesDb);
    this.estateStore.setFees(fees);

    let totalFees = 0;
    fees.map(f => totalFees += f.cost);
    this.estateStore.setTotalFees(totalFees);

    this.feesLoading = false;
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
