import { IEstate } from './../../models/estate.model';
import { IUser } from '../../models/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { makeAutoObservable } from 'mobx';


@Injectable()
export class EstateStore {
  public estate: IEstate = null;


  get estateId(): string {
    return this.estate?.id || null;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public setEstate(estate: IEstate): void {
    this.estate = estate;
  }

  public reset(): void {
    this.estate = null;
  }

}
