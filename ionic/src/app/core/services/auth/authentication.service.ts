import { UsersStore } from './../../stores/users/users.store';
import { IFirestore, IAuth, Firestore, Auth } from './../../../firebase';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private firestore: IFirestore;

  private isAuthLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthLoading$ = this.isAuthLoadingSubject$.asObservable();

  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(this.checkLoggedUserState());
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private firebaseAuth: IAuth;

  constructor(
    private router: Router,
    private usersStore: UsersStore
  ) {
    this.firebaseAuth = Auth();
    this.firestore = Firestore();

    this.firebaseAuth.onAuthStateChanged((user) => {
      this.usersStore.setUser(user ? JSON.parse(localStorage.getItem('user')) : null);
      this.isAuthenticatedSubject$.next(!!user);
      this.isAuthLoadingSubject$.next(true);
    });

    this.isAuthLoadingSubject$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        const user = this.usersStore?.user;

        if (user) {

        }
      } else {

      }
    });
  }

  public async getUserToken() { return await this.firebaseAuth.currentUser.getIdToken(); }

  public async signIn(email: string, password: string): Promise<string> {
    try {
      const firebaseUser = await this.firebaseAuth.signInWithEmailAndPassword(email, password);
      return firebaseUser.user.uid;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async signUp(email: string, password: string): Promise<string> {
    try {
      const firebaseUser = await this.firebaseAuth.createUserWithEmailAndPassword(email.toLowerCase(), password);
      return firebaseUser.user.uid;
    } catch (error) {
      console.error(error);
    }
  }

  public async resetPassword(email: string): Promise<void> {
    try {
      return await this.firebaseAuth.sendPasswordResetEmail(email.toLowerCase());
    } catch (error) {
      console.error(error);
    }
  }

  public async signOut(navigateOnSignIn: boolean = true): Promise<void> {
    await this.firebaseAuth.signOut();

    this.usersStore.reset();
    if (navigateOnSignIn) {
      this.router.navigate(['/signin']);
    }
  }

  private checkLoggedUserState(): any {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      this.usersStore.setUser(user);
      return true;
    }
    return false;
  }

}
