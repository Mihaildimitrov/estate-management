import { IUser } from './../../models/user.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { makeAutoObservable } from 'mobx';


@Injectable()
export class UsersStore {
  public user: IUser = null;


  get userId(): string {
    return this.user?.id || null;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public setUser(user: IUser): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  public reset(): void {
    this.user = null;
  }

}
