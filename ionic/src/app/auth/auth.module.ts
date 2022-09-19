import { authRoutes } from './auth.routing';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { SigninComponent } from './views/signin/signin.component';
import { SignupComponent } from './views/signup/signup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes),
    SharedModule
  ]
})
export class AuthModule { }
