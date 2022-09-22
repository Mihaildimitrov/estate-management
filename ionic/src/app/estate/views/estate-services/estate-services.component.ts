import { ServerTimestamp } from 'src/app/firebase';
import { EstateStore } from './../../../core/stores/estate/estate.store';
import { UsersStore } from './../../../core/stores/users/users.store';
import { EstateService } from './../../../core/services/estate/estate.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ToastController } from '@ionic/angular';
import { IEstate } from './../../../core/models/estate.model';
import { IService } from './../../../core/models/service.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estate-services',
  templateUrl: './estate-services.component.html',
  styleUrls: ['./estate-services.component.scss'],
})
export class EstateServicesComponent implements OnInit {

  public servicesLoading = true;
  public saveLoading = false;
  public form: FormGroup;

  public get estate(): IEstate {
    return this.estateStore.estate
  }

  public get services(): IService[] {
    return this.estateStore.services;
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

    if (!this.services.length) {
      await this.loadServices();
    } else {
      this.servicesLoading = false;
    }
  }

  public async edit(fee: IService): Promise<void> { }

  public async remove(id: string): Promise<void> { }

  public async save(): Promise<void> {
    if (this.form.valid) {
      this.saveLoading = true;
      const payload: IService = {
        id: null,
        cost: this.form.value.cost,
        description: this.form.value.description,
        createAt: ServerTimestamp(),
        createBy: this.usersStore.userId,
        updateAt: null,
        updateBy: null,
      };

      await this.estateService.addService(this.estate.id, payload);
      this.form.reset();
      this.saveLoading = false;
      this.servicesLoading = true;
      this.loadServices();
    }
  }

  private async loadServices() {
    const services = await this.estateService.getAllEstateServices(this.estate.id);
    this.estateStore.setServices(services);

    let totalServices = 0;
    services.map(m => totalServices += m.cost);
    this.estateStore.setTotalServices(totalServices);

    this.servicesLoading = false;
  }

}
