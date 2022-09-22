import { IMaterial } from './../../models/material.models';
import { IService } from './../../models/service.model';
import { IFee } from './../../models/fee.model';
import { IEstate } from './../../models/estate.model';
import { IUser } from '../../models/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { makeAutoObservable } from 'mobx';


@Injectable()
export class EstateStore {
  public estate: IEstate = null;

  public fees: IFee[] = [];
  public services: IService[] = [];
  public materials: IMaterial[] = [];

  public totalFees: number = 0;
  public totalServices: number = 0;
  public totalMaterials: number = 0;


  get estateId(): string {
    return this.estate?.id || null;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public setEstate(estate: IEstate): void {
    this.estate = estate;
  }

  public setFees(fees: IFee[]): void {
    this.fees = fees;
  }

  public setServices(services: IService[]): void {
    this.services = services;
  }

  public setMaterials(materials: IMaterial[]): void {
    this.materials = materials;
  }

  public setTotalFees(v: number): void {
    this.totalFees = v;
  }

  public setTotalServices(v: number): void {
    this.totalServices = v;
  }

  public setTotalMaterials(v: number): void {
    this.totalMaterials = v;
  }

  public reset(): void {
    this.estate = null;
    this.fees = [];
    this.services = [];
    this.materials = [];
    this.totalFees = 0;
    this.totalServices = 0;
    this.totalMaterials = 0;
  }

}
