import { Routes } from '@angular/router';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { SigninComponent } from './views/signin/signin.component';
import { SignupComponent } from './views/signup/signup.component';

export const authRoutes: Routes = [
    {
        path: 'signin',
        component: SigninComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'resetpassword',
        component: ResetPasswordComponent
    }
];