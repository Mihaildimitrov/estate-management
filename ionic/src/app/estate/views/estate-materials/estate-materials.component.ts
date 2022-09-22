import { ServerTimestamp } from 'src/app/firebase';
import { IEstate } from './../../../core/models/estate.model';
import { ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/core/services/users/users.service';
import { EstateService } from './../../../core/services/estate/estate.service';
import { UsersStore } from './../../../core/stores/users/users.store';
import { EstateStore } from './../../../core/stores/estate/estate.store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMaterial } from './../../../core/models/material.models';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estate-materials',
  templateUrl: './estate-materials.component.html',
  styleUrls: ['./estate-materials.component.scss'],
})
export class EstateMaterialsComponent implements OnInit {

  public materialsLoading = true;
  public saveLoading = false;
  public form: FormGroup;

  public get estate(): IEstate {
    return this.estateStore.estate
  }

  public get materials(): IMaterial[] {
    return this.estateStore.materials;
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

    if (!this.materials.length) {
      await this.loadMaterials();
    } else {
      this.materialsLoading = false;
    }
  }

  public async edit(fee: IMaterial): Promise<void> { }

  public async remove(id: string): Promise<void> { }

  public async save(): Promise<void> {
    if (this.form.valid) {
      this.saveLoading = true;
      const payload: IMaterial = {
        id: null,
        cost: this.form.value.cost,
        description: this.form.value.description,
        createAt: ServerTimestamp(),
        createBy: this.usersStore.userId,
        updateAt: null,
        updateBy: null,
      };

      await this.estateService.addMaterial(this.estate.id, payload);
      this.form.reset();
      this.saveLoading = false;
      this.materialsLoading = true;
      this.loadMaterials();
    }
  }

  private async loadMaterials() {
    const materials = await this.estateService.getAllEstateMaterials(this.estate.id);
    this.estateStore.setMaterials(materials);

    let totalMaterials = 0;
    materials.map(m => totalMaterials += m.cost);
    this.estateStore.setTotalMaterials(totalMaterials);

    this.materialsLoading = false;
  }

}
