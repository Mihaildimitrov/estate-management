import { GetEstateGuard } from './core/guards/get-estate.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'estate/:estateId',
    loadChildren: () => import('./estate/estate.module').then(m => m.EstateModule),
    canActivate: [AuthenticatedGuard, GetEstateGuard]
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
