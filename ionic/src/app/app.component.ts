import { AuthenticationService } from './core/services/auth/authentication.service';
import { UsersStore } from './core/stores/users/users.store';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isAuthLoading$: Observable<boolean>;
  public isAuthenticated$: Observable<boolean>;

  public menuItems = [
    { title: 'Статистика', url: '/dashboard', icon: 'pie-chart-outline' },
    { title: 'Имоти', url: '/estates', icon: 'home-outline' },
  ];

  constructor(
    private menu: MenuController,
    private authenticationService: AuthenticationService,
    public usersStore: UsersStore
  ) {
    this.isAuthLoading$ = this.authenticationService.isAuthLoading$;
    this.isAuthenticated$ = this.authenticationService.isAuthenticated$;
  }

  ngOnInit() {

  }

  public signOut(): void {
    this.authenticationService.signOut();
    this.menu.close();
  }

}
