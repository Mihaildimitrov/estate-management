import { UsersStore } from './../../../core/stores/users/users.store';
import { AuthenticationService } from './../../../core/services/auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Auth, FirebaseAuthNamespace, IAuth } from 'src/app/firebase';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {

  public signinLoading = false;
  public form: FormGroup;

  private firebaseAuth: IAuth;
  private firebaseAuthNamespace;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UsersService,
    public usersStore: UsersStore,
    private toastController: ToastController
  ) {
    this.firebaseAuth = Auth();
    this.firebaseAuthNamespace = FirebaseAuthNamespace;
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(this.form ? this.form.controls.email.value : null, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.form.reset();
  }

  public async signin(): Promise<void> {

    if (this.form.valid) {
      this.signinLoading = true;
      const form = this.form.value;

      try {
        const userId = await this.authenticationService.signIn(form.email, form.password);
        const user = await this.userService.getOne(userId);

        this.usersStore.setUser(user);
        this.signinLoading = false;

        this.router.navigate([`/dashboard`]);
        setTimeout(() => this.ngOnDestroy(), 500);

      } catch (error) {
        this.presentToast('Грешна парола!');
        console.log(error);
      }
    }
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
