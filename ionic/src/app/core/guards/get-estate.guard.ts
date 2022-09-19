import { UsersStore } from './../stores/users/users.store';
import { EstateStore } from './../stores/estate/estate.store';
import { UsersService } from './../services/users/users.service';
import { EstateService } from './../services/estate/estate.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetEstateGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private router: Router,
    private estateService: EstateService,
    private usersService: UsersService,
    private estateStore: EstateStore,
    private usersStore: UsersStore
  ) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    console.log('========================== GET ESTATE GUARD ==========================');
    let currentEstate = this.router.getCurrentNavigation().extras.state ? this.router.getCurrentNavigation().extras.state.estate ? this.router.getCurrentNavigation().extras.state.estate : null : null;

    if (!currentEstate) {
      currentEstate = await this.estateService.getOne(next.params.estateId);
    }
    this.estateStore.setEstate(currentEstate);
    return currentEstate ? true : false;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
